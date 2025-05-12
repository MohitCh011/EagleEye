const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (req.user?.role !== requiredRole) {
        return res.status(403).json({ message: `Access denied. Only ${requiredRole}s are allowed.` });
    }
    next();
};

module.exports = roleMiddleware;
