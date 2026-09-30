const db = require('../config/db');

// 1. API POST: Tạo đơn hàng mới từ Mobile + TỰ ĐỘNG TRỪ TỒN KHO
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const {
      customer_name,
      customer_phone,
      delivery_address,
      note,
      subtotal,
      discount_amount,
      shipping_fee,
      total_amount,
      payment_method,
      items, // [{ product_id, quantity, price }]
    } = req.body;

    if (!customer_name || !customer_phone || !delivery_address) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin người nhận hàng!' });
    }

    // Bắt đầu Transaction đảm bảo an toàn tuyệt đối
    await connection.beginTransaction();

    // 1. Lưu vào bảng orders
    const orderQuery = `
      INSERT INTO orders (customer_name, customer_phone, delivery_address, note, subtotal, discount_amount, shipping_fee, total_amount, payment_method, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')
    `;

    const [orderResult] = await connection.query(orderQuery, [
      customer_name,
      customer_phone,
      delivery_address,
      note || '',
      subtotal || 0,
      discount_amount || 0,
      shipping_fee || 15000,
      total_amount,
      payment_method || 'COD',
    ]);

    const newOrderId = orderResult.insertId;

    // 2. Lưu từng món vào order_items VÀ TRỪ KHO TỰ ĐỘNG
    if (items && items.length > 0) {
      const itemQuery = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ?
      `;
      const itemValues = items.map((item) => [
        newOrderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);

      await connection.query(itemQuery, [itemValues]);

      // 👉 VÒNG LẶP TỰ ĐỘNG TRỪ TỒN KHO (STOCK) TRONG DATABASE
      for (const item of items) {
        await connection.query(
          'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
    }

    // Hoàn tất giao dịch
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Đặt hàng và trừ tồn kho thành công!',
      order_id: `#ORD-${newOrderId}`,
    });
  } catch (error) {
    await connection.rollback();
    console.error('Lỗi tạo đơn hàng:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// 2. API GET: Lấy danh sách đơn hàng THỰC TẾ từ MySQL kèm các món
exports.getOrders = async (req, res) => {
  try {
    const { phone } = req.query;
    let query = `SELECT * FROM orders`;
    const params = [];

    if (phone) {
      query += ` WHERE customer_phone = ?`;
      params.push(phone);
    }

    query += ` ORDER BY id DESC`;

    const [orders] = await db.query(query, params);

    // Lấy kèm các món của từng đơn hàng
    for (const o of orders) {
      const [items] = await db.query(`
        SELECT oi.*, p.name AS product_name, p.cover_image, p.weight
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [o.id]);

      o.items = items.map(it => ({
        product: { 
          id: it.product_id, 
          name: it.product_name, 
          price: it.price, 
          cover_image: it.cover_image, 
          weight: it.weight 
        },
        quantity: it.quantity,
        price: it.price
      }));
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. API GET: Lấy danh sách các món có trong 1 đơn hàng (phục vụ bảng tóm tắt không ảnh)
exports.getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;
    const [items] = await db.query(`
      SELECT oi.*, p.name AS product_name, p.weight
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};