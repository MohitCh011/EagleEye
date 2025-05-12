const Project = require("../models/Project");

// Fetch geolocation data for top 10 projects
const getProjectRoutes = async (req, res) => {
    try {
        const topProjects = await Project.find()
            .sort({ progress: -1 }) // Sort by progress in descending order
            .limit(10)
            .select("projectName startCoordinates endCoordinates progress");

        const routes = topProjects.map((project) => ({
            id: project._id,
            name: project.projectName,
            start: project.startCoordinates,
            end: project.endCoordinates,
            progress: project.progress,
        }));

        res.status(200).json({ success: true, data: routes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getProjectRoutes,
};
