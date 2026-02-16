const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/api/order', express.json(), orderController.placeOrder);
router.get('/orders', orderController.getMyOrders);

module.exports = router;
