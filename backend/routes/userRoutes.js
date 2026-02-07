const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users/login
router.post('/login', async (req, res) => {
    const { name, email, googleId, photo } = req.body;

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists? Great, return their profile
            return res.json(user);
        } else {
            // User doesn't exist? Create them!
            user = new User({
                name,
                email,
                googleId,
                photo
            });
            await user.save();
            return res.json(user);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

// PUT /api/users/update (To save phone/address later)
router.put('/profile', async (req, res) => {
    const { email, phone, address } = req.body; // <--- Frontend must send these 3 things

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: email }, // Find by Email
            { phone, address }, // Update these fields
            { new: true } // Return the new updated version
        );
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Update failed" });
    }
});

// 👇 ADD THIS NEW ROUTE
// GET /api/users/:email - Get user details (address/phone)
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;