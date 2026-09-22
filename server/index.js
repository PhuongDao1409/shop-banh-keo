const express = require('express');
const cors = require('cors');

// Import các routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); // <-- Thêm route admin

const app = express();
app.use(cors());
app.use(express.json());

// Gắn các đường dẫn API
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // <-- Mở cụm API quản trị

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Shop Banh Keo chay tai: http://localhost:${PORT}`);
  console.log(`API Admin: http://localhost:${PORT}/api/admin/dashboard`);
});