const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    try {
        // 👇 ADD 'address' TO THIS LIST
        const { customerName, email, phoneNumber, address, items, totalAmount } = req.body;

        const newOrder = new Order({
            customerName,
            email,
            phoneNumber,
            address, // <--- SAVE IT HERE
            items,
            totalAmount,
            status: "Pending"
        });

        const savedOrder = await newOrder.save();

        // Notify Admin
        const io = req.app.get('socketio');
        io.emit('new-order', savedOrder); 

        res.status(201).json(savedOrder);
    } catch (err) {
        console.error("Order Error:", err);
        res.status(500).json({ message: "Failed to place order" });
    }
});

module.exports = router;