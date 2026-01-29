// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Starters', 'Main Course', 'Desserts', 'Drinks'] // Add your friend's actual categories
    },
    description: { 
        type: String 
    },
    image: { 
        type: String, // We will store the URL here
        default: "https://placehold.co/400" 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);