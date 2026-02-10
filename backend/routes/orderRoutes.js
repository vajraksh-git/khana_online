const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
    try {
        // 👇 Add 'combos' to the destructuring
        const { customerName, email, phoneNumber, address, items, combos, totalAmount } = req.body;

        const newOrder = new Order({
            customerName,
            email,
            phoneNumber,
            address,
            items: items || [],   // Default to empty array if no standard items
            combos: combos || [], // Default to empty array if no combos
            totalAmount,
            status: "Pending"
        });

        const savedOrder = await newOrder.save();

        const io = req.app.get('socketio');
        io.emit('new-order', savedOrder); 

        res.status(201).json(savedOrder);
    } catch (err) {
        console.error("Order Error:", err);
        res.status(500).json({ message: "Failed to place order" });
    }
});

module.exports = router;