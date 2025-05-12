const express = require("express");
const { getProjectRoutes } = require("../controllers/mapController");

const router = express.Router();

// Fetch geolocation data for top 10 projects (No authentication required)
router.get("/routes", getProjectRoutes);

module.exports = router;
