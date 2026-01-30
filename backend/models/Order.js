// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // 1. Who placed the order? (We will link this to a User later)
    customerName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    
    // 2. What did they order? (An Array of Items)
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem', // <--- This links to your Menu Model!
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            name: String, // Store name too, in case you delete the menu item later
            price: Number // Store price at time of order (prices change!)
        }
    ],

    // 3. The Bill
    totalAmount: {
        type: Number,
        required: true
    },

    // 4. The Kitchen Status
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    
    // 5. Payment Info (Future proofing)
    paymentMethod: {
        type: String,
        enum: ['Cash', 'UPI'],
        default: 'Cash'
    }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);