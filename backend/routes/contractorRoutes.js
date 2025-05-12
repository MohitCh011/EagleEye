// routes/contractorRoutes.js
const express = require("express");
const { addInspectorToProject ,getContractorDashboardData ,getContractorProjects} = require("../controllers/contractorController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();
router.get("/dashboard", authMiddleware, roleMiddleware("Contractor"), getContractorDashboardData);
router.post(
    "/add-inspector",
    authMiddleware,
    roleMiddleware("Contractor"),
    addInspectorToProject
);
router.get("/projects", authMiddleware, roleMiddleware("Contractor"), getContractorProjects);
module.exports = router;
