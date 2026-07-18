const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { authenticate, isAdmin } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/auth');


// server.js
app.use('/', userRoutes);     // Public: Login/Register
app.use('/api', productRoutes);   // Public: See products/cats
app.use('/orders', orderRoutes);  // Public/User: Place orders
app.use('/admin', authenticate, isAdmin, adminRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
