const express = require("express");
const { createPhase ,savePhase} = require("../controllers/phaseController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware")
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Phase routes
router.post(
    "/create",
    authMiddleware,
    roleMiddleware("Inspector"),
    upload.single("image"),
    createPhase
);

// router.post("/save", authMiddleware, roleMiddleware("Inspector"), savePhase);

module.exports = router;
