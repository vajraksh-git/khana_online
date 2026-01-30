// controllers/orderController.js
const Order = require('../models/Order');

// @desc    Place a new order
// @route   POST /api/orders
const placeOrder = async (req, res) => {
    try {
        const { customerName, phoneNumber, items, totalAmount, paymentMethod } = req.body;

        // 1. Create the Order in Database
        const newOrder = new Order({
            customerName,
            phoneNumber,
            items,
            totalAmount,
            paymentMethod
        });

        const savedOrder = await newOrder.save();

        // 2. REAL-TIME MAGIC: Alert the Kitchen!
        const io = req.app.get('socketio'); // Grab the io instance
        io.emit('new_order', savedOrder);   // Shout to everyone listening

        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { placeOrder };