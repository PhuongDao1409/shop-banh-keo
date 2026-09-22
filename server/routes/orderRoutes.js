const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders -> Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// GET /api/orders -> Lấy danh sách đơn hàng
router.get('/', orderController.getOrders);

// GET /api/orders/:id/items -> Lấy chi tiết các món trong đơn #id
router.get('/:id/items', orderController.getOrderItems);

module.exports = router;