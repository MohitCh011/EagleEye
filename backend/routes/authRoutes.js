const express = require("express");
const { signup, login, logout, sendOtp, changePassword } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-otp", sendOtp);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
