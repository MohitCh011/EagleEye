const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

const { getProfile, updateProfile, contactIT, contactAdmin } = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Profile Routes
router.get("/getdetails", authMiddleware, getProfile); // View profile details
router.patch("/updateprofile", authMiddleware, upload.single('profileImage'), updateProfile); // Update profile with image upload
router.get("/contact-it", authMiddleware, contactIT); // Contact IT for Admin password change
router.get("/contact-admin", authMiddleware, contactAdmin); // Contact Admin for Contractor password change

module.exports = router;
