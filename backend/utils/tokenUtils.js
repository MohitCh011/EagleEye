const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const validateToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};

module.exports = {
    generateToken,
    validateToken,
};
