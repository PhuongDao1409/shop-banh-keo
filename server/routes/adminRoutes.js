const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Thống kê Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Cập nhật trạng thái đơn hàng (Duyệt đơn 1 chiều)
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Quản lý nhập hàng (Tự động cộng kho)
router.post('/imports', adminController.createImportOrder);
router.get('/imports', adminController.getImportOrders);

// Quản lý sản phẩm (Thêm, Sửa, Xóa)
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Lấy danh sách Hãng / Nhà phân phối (cho dropdown nhập kho)
router.get('/brands', adminController.getBrands);

module.exports = router;