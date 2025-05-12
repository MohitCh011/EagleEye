const express = require("express");
const {
    createProject,
    editProject,
    getDashboardData,
    deleteProject,
    markProjectAsCompleted,
    resetContractorPassword,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

// Admin Routes
router.post("/create-project", authMiddleware, roleMiddleware("Admin"), createProject);
router.patch("/edit-project", authMiddleware, roleMiddleware("Admin"), editProject);
router.get("/dashboard", authMiddleware, roleMiddleware("Admin"), getDashboardData);
router.delete("/delete-project/:projectId", authMiddleware, roleMiddleware("Admin"), deleteProject);
router.patch("/mark-project-comcpleted/:projectId", authMiddleware, roleMiddleware("Contractor"), markProjectAsCompleted);

// Reset Contractor Password
router.post("/reset-contractor-password", authMiddleware, roleMiddleware("Admin"), resetContractorPassword);

module.exports = router;
