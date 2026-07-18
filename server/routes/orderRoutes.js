const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateStatus);
router.get('/report', orderController.getSalesReport);
router.get('/:userId', orderController.getUserOrders);

module.exports = router;