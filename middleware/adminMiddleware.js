require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require("../model/user");

const isAdmin = async (req, res, next) => {
    try {
        // Extract token from "token" header
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied', success: false });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded);

        if (!decoded.userId) {
            return res.status(400).json({ success: false, error: 'Token does not contain user ID' });
        }

        // Fetch user from database
        const adminUser = await User.findById(decoded.userId);

        if (!adminUser) {
            console.log("User not found in database!");
            return res.status(403).json({ message: 'User not found', success: false });
        }

        // Check if the user is actually an Admin
        if (adminUser.role !== "admin") {
            console.log("User is not an admin!"); 
            return res.status(403).json({ message: 'Access denied. Not authorized as admin', success: false });
        }

        console.log("Admin authenticated:", adminUser.email);
        req.user = adminUser;
        next(); 

    } catch (error) {
        console.error("Admin Auth Error:", error.message);
        return res.status(401).json({ message: 'Token is not valid', success: false, error: error.message });
    }
};

module.exports = { isAdmin };
