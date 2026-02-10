const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: String,
    email: String,
    phoneNumber: String,
    address: String,
    // Keep existing items (for standard orders)
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    // 👇 NEW: Add this to store the Custom Platters
    combos: [
        {
            name: String,   // e.g., "3-Course Platter"
            cuisine: String, // e.g., "North Indian"
            details: Object, // e.g., { main: "Butter Chicken", side: "Dal", staple: "Naan" }
            price: Number
        }
    ],
    totalAmount: Number,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);