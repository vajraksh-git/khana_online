const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/orderController');

// POST /api/orders - Create a new order
router.post('/', placeOrder);

module.exports = router;