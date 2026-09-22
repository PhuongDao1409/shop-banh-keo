const db = require('../config/db');

// 1. API GET: Thống kê tổng quan Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Tổng doanh thu từ các đơn COMPLETED (Đã giao)
    const [rev] = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE status = 'COMPLETED'"
    );

    // Số đơn đang chờ xác nhận
    const [pending] = await db.query(
      "SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'PENDING'"
    );

    // Tổng số mặt hàng bánh kẹo trong kho
    const [prods] = await db.query(
      "SELECT COUNT(*) AS total_products, COALESCE(SUM(stock), 0) AS total_stock FROM products"
    );

    // Số mặt hàng sắp hết kho (stock < 10) hoặc cận date
    const [alerts] = await db.query(
      "SELECT COUNT(*) AS low_stock FROM products WHERE stock < 10 OR is_near_expiry = TRUE"
    );

    res.json({
      success: true,
      data: {
        total_revenue: rev[0].total_revenue,
        pending_orders: pending[0].pending_orders,
        total_products: prods[0].total_products,
        total_stock: prods[0].total_stock,
        alerts: alerts[0].low_stock,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. API PUT: Cập nhật trạng thái đơn hàng (Duyệt đơn từ Web Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'CONFIRMED', 'SHIPPING', 'COMPLETED', 'CANCELED'

    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    res.json({ success: true, message: `Đã cập nhật đơn #${id} sang trạng thái: ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. API POST: Tạo phiếu nhập hàng -> TỰ ĐỘNG CỘNG TỒN KHO (STOCK)
exports.createImportOrder = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { supplier_name, total_cost, note, items } = req.body;
    // items: [{ product_id, quantity, import_price }]

    if (!supplier_name || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin nhà cung cấp hoặc sản phẩm nhập!' });
    }

    await connection.beginTransaction();

    // 1. Tạo phiếu nhập trong import_orders
    const [importResult] = await connection.query(
      'INSERT INTO import_orders (supplier_name, user_id, total_cost, note) VALUES (?, 1, ?, ?)',
      [supplier_name, total_cost, note || '']
    );

    const importId = importResult.insertId;

    // 2. Lưu chi tiết phiếu nhập
    const itemQuery = 'INSERT INTO import_order_items (import_order_id, product_id, quantity, import_price) VALUES ?';
    const itemValues = items.map((it) => [importId, it.product_id, it.quantity, it.import_price]);
    await connection.query(itemQuery, [itemValues]);

    // 3. 👉 TỰ ĐỘNG CỘNG TỒN KHO CHO TỪNG SẢN PHẨM
    for (const it of items) {
      await connection.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [it.quantity, it.product_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Tạo phiếu nhập và cộng kho thành công!',
      import_id: `#PN-${importId}`,
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// 4. API GET: Lấy danh sách lịch sử các phiếu nhập
exports.getImportOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM import_orders ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. API POST: Thêm sản phẩm bánh kẹo mới từ Web Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, brand_id, price, original_price, weight, expiry_date, flavor, packaging, ingredients, cover_image, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Tên bánh kẹo và giá bán không được để trống!' });
    }

    await db.query(`
      INSERT INTO products (name, category_id, brand_id, price, original_price, weight, expiry_date, flavor, packaging, ingredients, cover_image, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      category_id || 1,
      brand_id || 1,
      price,
      original_price || price,
      weight || '200g',
      expiry_date || '12 tháng',
      flavor || 'Đặc biệt',
      packaging || 'Hộp',
      ingredients || 'Nguyên liệu tự nhiên an toàn vệ sinh thực phẩm',
      cover_image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
      stock || 50,
    ]);

    res.status(201).json({ success: true, message: 'Thêm bánh kẹo mới thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. API DELETE: Xóa bánh kẹo
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true, message: 'Xóa bánh kẹo thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 7. API PUT: Sửa thông tin sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, original_price, weight, expiry_date, flavor, packaging, ingredients, cover_image, stock } = req.body;

    await db.query(`
      UPDATE products 
      SET name = ?, price = ?, original_price = ?, weight = ?, expiry_date = ?, flavor = ?, packaging = ?, ingredients = ?, cover_image = ?, stock = ?
      WHERE id = ?
    `, [
      name, price, original_price || price, weight, expiry_date, flavor, packaging, ingredients, cover_image, stock, id
    ]);

    res.json({ success: true, message: 'Cập nhật sản phẩm thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 8. API GET: Lấy danh sách Nhà phân phối / Hãng (cho ô Dropdown khi nhập kho)
exports.getBrands = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM brands ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};