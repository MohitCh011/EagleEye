const express = require("express");
const { contactUs } = require("../controllers/contactUsController");

const router = express.Router();

// Contact Us Route
router.post("/", contactUs);

module.exports = router;
