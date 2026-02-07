const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerName: String,
    email: String,
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true }, // <--- ADD THIS
    items: [
        {
            menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);