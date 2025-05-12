const express = require("express");
const {
    getAllAdmins,
    addAdmin,
    deleteAdmin,
    resetAdminPassword,
} = require("../controllers/ItAdminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// IT Admin routes
router.get("/admins", authMiddleware, roleMiddleware("IT Admin"), getAllAdmins); // View all admins
router.post("/admins/createadmin", authMiddleware, roleMiddleware("IT Admin"), addAdmin); // Add new admin
router.delete("/admins/:adminId", authMiddleware, roleMiddleware("IT Admin"), deleteAdmin); // Delete an admin
router.post("/admins/reset-password", authMiddleware, roleMiddleware("IT Admin"), resetAdminPassword); // Reset admin password

module.exports = router;
