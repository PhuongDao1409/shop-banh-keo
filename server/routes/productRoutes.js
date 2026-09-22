const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products -> Lấy danh sách bánh kẹo
router.get('/', productController.getAllProducts);

// GET /api/products/:id -> Xem chi tiết 1 món
router.get('/:id', productController.getProductById);

module.exports = router;