const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const MenuItem = require('../models/MenuItem'); 
const Order = require('../models/Order'); 

// --- CONFIG: Image Storage ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// --- 1. ADMIN LOGIN ---
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple check. In production, use .env variables
    if (username === "admin" && password === "boss") {
        res.json({ success: true, token: "admin-secret-token" });
    } else {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
});

// --- 2. MENU MANAGEMENT ---

// ADD Item (with Image)
router.post('/menu', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";
        
        const newItem = new MenuItem({ name, price, category, description, image: imageUrl });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE Item
router.put('/menu/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        let updateData = { name, price, category, description };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Item
router.delete('/menu/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. KITCHEN ORDERS ---
router.get('/orders', async (req, res) => {
    try {
        // Get all incomplete orders, newest first
        const orders = await Order.find({ status: { $ne: 'Completed' } }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/orders/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;