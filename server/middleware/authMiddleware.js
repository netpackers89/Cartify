const User = require('../models/User'); // Import your User model

exports.authenticate = async (req, res, next) => {
    // The client stores the logged-in user's id as its lightweight session token.
    // Accept the current Bearer header as well as the legacy user-id header.
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith('Bearer ')
        ? authorization.slice(7).trim()
        : null;
    const userId = req.headers['user-id'] || bearerToken;

    if (!userId) {
        return res.status(401).json("Authentication required");
    }

    try {
        // 2. Find the user in the database
        const user = await User.findById(userId);
        if (!user) return res.status(401).json("User not found");

        // 3. Attach user to the request object so isAdmin can see it
        req.user = user; 
        next();
    } catch (err) {
        res.status(401).json("Invalid authentication token");
    }
};

exports.isAdmin = (req, res, next) => {
    // Now req.user exists because 'authenticate' ran first
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json("Access Denied");
    }
};
