const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Check for token in Authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"
        // If no token is found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token payload to request object
        next();
    } catch (err) {
        console.error("Error in authMiddleware:", err.message);
        res.status(403).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

module.exports = authMiddleware;
