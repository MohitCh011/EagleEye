const Project = require("../models/Project");
const Phase = require("../models/Phase");
const uploadImageToCloudinary = require("../utils/cloudinaryUploader");
const runMLModel = require("../utils/runMLModel");

// View assigned projects
const getInspectorProjects = async (req, res) => {
    try {
        if (req.user.role !== "Inspector") {
            return res.status(403).json({ message: "Access denied. Inspectors only." });
        }

        // Fetch projects assigned to the inspector
        const projects = await Project.find({ assignedInspectors: req.user.id })
            .populate({
                path: "phases",
                select: "imageUrl budgetUsed progress analysisResults createdAt updatedAt",
            })
            .populate({
                path: "assignedInspectors",
                select: "firstName lastName email role",
            })
            .select(
                "_id projectName budget status startCoordinates endCoordinates progress createdAt updatedAt"
            );

        // Loop through projects and update progress
        for (const project of projects) {
            await updateProjectProgress(project); // This should update the project progress correctly
        }

        res.status(200).json({
            success: true,
            data: projects.map((project) => ({
                id: project._id,
                projectName: project.projectName,
                budget: project.budget,
                status: project.status,
                startCoordinates: project.startCoordinates,
                endCoordinates: project.endCoordinates,
                progress: project.progress,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                phases: project.phases,
                assignedInspectors: project.assignedInspectors,
            })),
        });
    } catch (err) {
        console.error("Error in getInspectorProjects:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// Inspector dashboard data
const getInspectorDashboardData = async (req, res) => {
    try {
        if (req.user.role !== "Inspector") {
            return res.status(403).json({ message: "Access denied. Inspectors only." });
        }

        const totalAssignedProjects = await Project.countDocuments({
            assignedInspectors: req.user.id,
        });

        const completedAssignedProjects = await Project.countDocuments({
            assignedInspectors: req.user.id,
            status: "Completed",
        });

        const ongoingAssignedProjects = await Project.countDocuments({
            assignedInspectors: req.user.id,
            status: "Under Construction",
        });

        res.status(200).json({
            success: true,
            data: {
                totalAssignedProjects,
                completedAssignedProjects,
                ongoingAssignedProjects,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// Contractor dashboard data


// Utility function to update project progress
const updateProjectProgress = async (project) => {
    if (project.phases && project.phases.length > 0) {
        const phases = await Phase.find({ _id: { $in: project.phases } });
        const totalProgress = phases.reduce((acc, phase) => acc + phase.progress, 0);
        const averageProgress = totalProgress / phases.length;
        project.progress = Math.round(averageProgress);
        await project.save();
    } else {
        project.progress = 0;
        await project.save();
    }
};

module.exports = {
    getInspectorDashboardData,
    getInspectorProjects,
};
