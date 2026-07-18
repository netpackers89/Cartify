const mongoose = require('mongoose');

const ProductSchema =new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    countInStock: { type: Number, default: 0, min: 0 },
    // reservedCount tracks units that have been reserved for pending/approved orders
    reservedCount: { type: Number, default: 0, min: 0 },
     category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', required: true } ,
     favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
});


module.exports = mongoose.model('products', ProductSchema);

