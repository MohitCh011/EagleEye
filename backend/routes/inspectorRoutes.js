const express = require("express");
const {
    createPhase,
    savePhase,
} = require("../controllers/phaseController");
const { getInspectorDashboardData,getInspectorProjects } = require("../controllers/inspectorController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Inspector routes

router.get("/projects", authMiddleware, roleMiddleware("Inspector"), getInspectorProjects);
router.get("/dashboard", authMiddleware, roleMiddleware("Inspector"), getInspectorDashboardData);
module.exports = router;
