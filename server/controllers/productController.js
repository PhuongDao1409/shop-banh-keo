const db = require('../config/db');

// Lấy danh sách bánh kẹo (có tìm kiếm, lọc danh mục, hàng nổi bật, hàng cận date)
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category_id, is_featured, is_near_expiry } = req.query;
    
    let query = `
      SELECT p.*, c.name AS category_name, b.name AS brand_name, b.origin AS brand_origin
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR b.name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category_id) {
      query += ` AND p.category_id = ?`;
      params.push(category_id);
    }

    if (is_featured === 'true') {
      query += ` AND p.is_featured = TRUE`;
    }

    if (is_near_expiry === 'true') {
      query += ` AND p.is_near_expiry = TRUE`;
    }

    query += ` ORDER BY p.id DESC`;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy chi tiết 1 món bánh kẹo kèm theo đánh giá
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [products] = await db.query(`
      SELECT p.*, c.name AS category_name, b.name AS brand_name, b.origin AS brand_origin
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ?
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    const [reviews] = await db.query(
      `SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC`,
      [id]
    );

    const productData = products[0];
    productData.reviews = reviews;

    res.json(productData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};