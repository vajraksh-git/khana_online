const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const MenuItem = require('../models/MenuItem');

// --- 1. SETUP IMAGE STORAGE ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // <--- Images go here
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique name
    }
});
const upload = multer({ storage: storage });

// --- 2. GET ALL ITEMS (Public) ---
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 3. ADD ITEM (Admin Only) ---
// Note: 'image' matches the name used in Frontend FormData
router.post('/', upload.single('image'), async (req, res) => {
    const { name, price, category, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    try {
        const newItem = new MenuItem({
            name,
            price,
            category,
            description,
            image
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: "Error saving item" });
    }
});

// --- 4. DELETE ITEM ---
router.delete('/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting item" });
    }
});

module.exports = router;