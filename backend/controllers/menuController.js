// controllers/menuController.js
const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenu = async (req, res) => {
    try {
        const menu = await MenuItem.find({});
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new item
// @route   POST /api/menu
// @access  Public (for now)
const addMenuItem = async (req, res) => {3
    try {
        const { name, price, category, description, image } = req.body;
        
        const newItem = new MenuItem({
            name,
            price,
            category,
            description,
            image
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getMenu, addMenuItem };