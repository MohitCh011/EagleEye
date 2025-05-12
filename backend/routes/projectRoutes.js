const express = require("express");
const {
    getTopProjects,
    getCompletedProjects,
    getOngoingProjects,
    addInspectorToProject,
    getAllProjects,
    getProjectDetails,
} = require("../controllers/projectController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Public Routes (No Auth Required)
router.get("/top/projects", getTopProjects); // Fetch top 10 projects
router.get("/completed", getCompletedProjects); // Fetch completed projects
router.get("/ongoing", getOngoingProjects); // Fetch ongoing projects

// Protected Routes (Require Auth)
router.get("/", authMiddleware, roleMiddleware("Admin"), getAllProjects); // Admin: All projects
router.get("/:id", authMiddleware, getProjectDetails); // Admin & Inspector: Project details



module.exports = router;
