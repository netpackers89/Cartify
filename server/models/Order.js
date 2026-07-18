// models/Order.js
const mongoose = require('mongoose'); // <--- THIS LINE IS MISSING

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'On Delivery', 'Completed'], default: 'Pending' },
    note: { type: String, default: '' },
    deliveryStartedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('orders', OrderSchema);
