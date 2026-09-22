const db = require('../config/db');

// API POST: Đăng nhập hệ thống (Kiểm tra quyền ADMIN)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' });
    }

    // Tìm tài khoản trong database
    const [users] = await db.query(
      'SELECT id, full_name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không chính xác!' });
    }

    const user = users[0];

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role, // Trả về role: 'ADMIN' hoặc 'CUSTOMER'
      },
    });
  } catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};