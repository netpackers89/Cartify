const UserModel = require('../models/User');

exports.register = async (req, res) => {
    try {
        const user = await UserModel.create(req.body);
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};

// controllers/userController.js

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        // Check password 
        if (user.password === password) {
            // Remove the password from the object before sending it to the frontend
            const { password, ...userWithoutPassword } = user.toObject();
            
            // Send the user data (which includes isAdmin, name, _id, etc.)
            return res.status(200).json({
                message: "Login successful",
                user: userWithoutPassword
            });
        } else {
            return res.status(401).json({ message: "Incorrect password" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
};

// controllers/userController.js
exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({ isAdmin: false }); // Only list clients
        res.json(users);
    } catch (err) { res.status(500).json(err); }
};

exports.updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await UserModel.findOneAndUpdate(
            { _id: req.params.id, isAdmin: false },
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'Customer not found' });
        res.json(user);
    } catch (err) {
        res.status(err.code === 11000 ? 409 : 400).json({ message: err.code === 11000 ? 'Email is already in use' : err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({ _id: req.params.id, isAdmin: false });
        if (!user) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) { res.status(400).json({ message: err.message }); }
};
