const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Project = require("../models/Project");
const sendEmail = require("../utils/sendEmail");
const Phase = require("../models/Phase");
const addInspectorToProject = async (req, res) => {
    try {
        const { projectId, inspectorEmail, inspectorfirstName } = req.body;

        // Fetch project and ensure the project exists
        const project = await Project.findById(projectId).populate("assignedContractor");

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Ensure only the contractor assigned to the project can add inspectors
        if (req.user.role !== "Contractor" || project.assignedContractor._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Access denied. Only the assigned contractor can add inspectors." });
        }

        // Check if the user already exists as an inspector
        let inspector = await User.findOne({ email: inspectorEmail });

        // Ensure the user being added is not an Admin or IT Admin
        if (inspector && (inspector.role === "Admin" ||inspector.role === "Contractor" || inspector.role === "IT Admin")) {
            return res.status(400).json({
                success: false,
                message: "The email is associated with an Admin or IT Admin. It cannot be added as an inspector."
            });
        }

        // If the inspector doesn't exist, create a new user
        if (!inspector) {
            const defaultPassword = "eagleeye@123";
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);

            inspector = await User.create({
                firstName: inspectorfirstName,
                lastName: "", // No last name provided
                email: inspectorEmail,
                password: hashedPassword,
                role: "Inspector",
                isFirstLogin: true,
            });

            // Send email notification to the newly created inspector
            await sendEmail(
                inspector.email,
                "Inspector Account Created",
                `
                <h3>Welcome!</h3>
                <p>Hello ${inspector.firstName},</p>
                <p>You have been added to the project <strong>${project.projectName}</strong> by ${req.user.firstName}.</p>
                <p>Use the default password <strong>"eagleeye@123"</strong> to log in and start updating progress.</p>
                `
            );
        }

        // Add the inspector to the project
        project.assignedInspectors.push(inspector._id);

        // Add the project to the inspector's assigned projects
        inspector.assignedProjects.push(project._id);
        
        // Save both the project and inspector documents
        await project.save();
        await inspector.save(); // Don't forget to save the inspector!

        res.status(200).json({
            success: true,
            message: "Inspector added to project successfully.",
            data: project,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const getContractorProjects = async (req, res) => {
    try {
        // Ensure the user is a contractor
        if (req.user.role !== "Contractor") {
            return res.status(403).json({ message: "Access denied. Contractors only." });
        }

        // Fetch projects assigned to the contractor
        const projects = await Project.find({ assignedContractor: req.user.id })
            .populate({
                path: "phases",
                select: "imageUrl progress analysisResults createdAt updatedAt",
            })
            .populate({
                path: "assignedInspectors",
                select: "firstName lastName email role",
            })
            .select(
                "_id projectName status startCoordinates endCoordinates progress createdAt updatedAt"
            );

        // Update progress for each project
        for (const project of projects) {
            await updateProjectProgress(project);
        }

        // Send response with project data
        
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
                phases: project.phases,
                assignedInspectors: project.assignedInspectors,
            })),
        });
    } catch (err) {
        console.error("Error in getContractorProjects:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
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
const getContractorDashboardData = async (req, res) => {
    try {
        // Ensure the user is a contractor
        if (req.user.role !== "Contractor") {
            return res.status(403).json({ message: "Access denied. Contractors only." });
        }

        // Fetch contractor-specific project counts and budget data
        const totalManagedProjects = await Project.countDocuments({
            assignedContractor: req.user.id,
        });

        const completedManagedProjects = await Project.countDocuments({
            assignedContractor: req.user.id,
            status: "Completed",
        });

        const ongoingManagedProjects = await Project.countDocuments({
            assignedContractor: req.user.id,
            status: "Under Construction",
        });


        res.status(200).json({
            success: true,
            data: {
                totalManagedProjects,
                completedManagedProjects,
                ongoingManagedProjects,
                // totalBudgetUtilized: totalBudgetUtilized[0]?.totalUtilized || 0,
            },
        });
    } catch (err) {
        console.error("Error in getContractorDashboardData:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getContractorProjects,
    addInspectorToProject,
    getContractorDashboardData,
};
