const Project = require("../models/Project");
const Phase = require("../models/Phase");


// Utility Function: Update Project Progress
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

// Fetch Top 10 Projects
const getTopProjects = async (req, res) => {
    try {
        const topProjects = await Project.find()
            .sort({ progress: -1 }) // Sort by progress in descending order
            .limit(10)
            .select("projectName createdAt status startCoordinates endCoordinates progress");

        res.status(200).json({
            success: true,
            data: topProjects,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Fetch Completed Projects
const getCompletedProjects = async (req, res) => {
    try {
        const completedProjects = await Project.find({ status: "Completed" })
            .select("projectName createdAt status startCoordinates endCoordinates progress");

        res.status(200).json({
            success: true,
            data: completedProjects,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Fetch Ongoing Projects
const getOngoingProjects = async (req, res) => {
    try {
        const ongoingProjects = await Project.find({ status: "Under Construction" })
            .select("projectName createdAt status startCoordinates endCoordinates progress");

        res.status(200).json({
            success: true,
            data: ongoingProjects,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Fetch all projects (Admin Only) with transfer history
const getAllProjects = async (req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        const projects = await Project.find()
            .populate("assignedContractor", "firstName lastName email role profileImage")
            .populate({
                path: "phases",
                select: "imageUrl progress analysisResults createdAt updatedAt",
            })
            .populate({
                path: "assignedInspectors",
                select: "firstName lastName profileImage",
            })
            .populate({
                path: "transferHistory.from transferHistory.to",
                select: "firstName lastName email role",
            })
            .select(
                "_id projectName status startCoordinates endCoordinates progress createdAt updatedAt"
            );

        for (const project of projects) {
            await updateProjectProgress(project);
        }

        res.status(200).json({
            success: true,
            data: projects.map((project) => ({
                id: project._id,
                projectName: project.projectName,
                // budget: project.budget,
                status: project.status,
                startCoordinates: project.startCoordinates,
                endCoordinates: project.endCoordinates,
                progress: project.progress,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                assignedContractor: project.assignedContractor,
                phases: project.phases,
                assignedInspectors: project.assignedInspectors,
                transferHistory: project.transferHistory,
            })),
        });
    } catch (err) {
        console.error("Error in getAllProjects:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Fetch project details (Admin, Contractor, or Assigned Inspector)
const getProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id)
            .populate("assignedContractor", "firstName lastName email role profileImage")
            .populate({
                path: "phases",
                select: "imageUrl progress analysisResults createdAt updatedAt",
            })
            .populate({
                path: "assignedInspectors",
                select: "firstName lastName email profileImage",
            })
            .populate({
                path: "transferHistory.from transferHistory.to",
                select: "firstName lastName email role",
            })
            .select(
                "projectName  status startCoordinates endCoordinates progress createdAt updatedAt"
            );

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        await updateProjectProgress(project);

        // Ensure access is limited to Admin, Contractor, or Assigned Inspector
        if (
            req.user.role === "Contractor" &&
            project.assignedContractor._id.toString() !== req.user.id
        ) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        if (
            req.user.role === "Inspector" &&
            !project.assignedInspectors.some(
                (inspector) => inspector._id.toString() === req.user.id
            )
        ) {
            return res.status(403).json({ success: false, message: "Access denied." });
        }

        res.status(200).json({
            success: true,
            data: {
                projectName: project.projectName,
                // budget: project.budget,
                status: project.status,
                startCoordinates: project.startCoordinates,
                endCoordinates: project.endCoordinates,
                progress: project.progress,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                assignedContractor: project.assignedContractor,
                assignedInspectors: project.assignedInspectors,
                phases: project.phases,
                // transferHistory: project.transferHistory,
            },
        });
    } catch (err) {
        console.error("Error in getProjectDetails:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Add Inspector to Project (Contractor Only)


module.exports = {
    getTopProjects,
    getCompletedProjects,
    getOngoingProjects,
    getAllProjects,
    getProjectDetails,
};
