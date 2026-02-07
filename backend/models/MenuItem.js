const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String } // This will save the URL like "/uploads/burger.jpg"
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);