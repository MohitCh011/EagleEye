const User = require("../models/User");
const Project = require("../models/Project");
const bcrypt = require("bcryptjs");
const generateDicebearImage = require("../utils/generateDicebearImage");
const sendEmail = require("../utils/sendEmail");

// Create a Project
const createProject = async (req, res) => {
    try {
        const { projectName, budget, startCoordinates, endCoordinates, contractorEmail, contractorFirstName } = req.body;

        if (!contractorFirstName) {
            return res.status(400).json({
                success: false,
                message: "Contractor first name is required."
            });
        }

        // Ensure the user is a valid contractor and not an Admin or IT Admin
        let contractor = await User.findOne({ email: contractorEmail });

        if (contractor && (contractor.role === "Admin" || contractor.role === "IT Admin")) {
            return res.status(400).json({
                success: false,
                message: "The email is already associated with an Admin or IT Admin. It cannot be used for a contractor."
            });
        }

        let isNewContractor = false;

        // If contractor doesn't exist, create a new contractor
        if (!contractor) {
            const defaultPassword = "eagleeye@123";
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            const dicebearUrl = generateDicebearImage(contractorFirstName);

            contractor = await User.create({
                firstName: contractorFirstName,
                lastName: "",
                email: contractorEmail,
                password: hashedPassword,
                role: "Contractor",
                profileImage: dicebearUrl,
                isFirstLogin: true,
            });

            isNewContractor = true;

            // Notify the contractor of account creation
            try {
                await sendEmail(
                    contractorEmail,
                    "New Contractor Account Created",
                    `
                    <h3>Welcome!</h3>
                    <p>Hello ${contractor.firstName},</p>
                    <p>Your contractor account has been created. Use the default password <strong>"eagleeye@123"</strong> to log in and start managing projects.</p>
                    `
                );
            } catch (emailErr) {
                console.error("Error sending account creation email:", emailErr.message);
            }
        }

        // Create the new project
        const newProject = await Project.create({
            projectName,
            budget: {
                allotted: budget,
            },
            startCoordinates,
            endCoordinates,
            assignedContractor: contractor._id,
        });

        // Update the contractor's assignedProjects array
        contractor.assignedProjects.push(newProject._id);
        await contractor.save();

        // Notify the contractor of project assignment
        try {
            await sendEmail(
                contractorEmail,
                "Project Assigned",
                `
                <h3>Congratulations!</h3>
                <p>Hello ${contractor.firstName},</p>
                <p>You have been assigned to manage the project <strong>"${projectName}"</strong>.</p>
                <p>Log in to your account to view the project details and start managing progress.</p>
                `
            );
        } catch (emailErr) {
            console.error("Error sending project assignment email:", emailErr.message);
        }

        res.status(201).json({
            success: true,
            message: "Project created and assigned to the contractor successfully.",
            data: newProject,
        });
    } catch (err) {
        console.error("Error in createProject:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Edit Project (Transfer to a New Contractor)
const editProject = async (req, res) => {
    try {
        const { projectId, newContractorEmail, contractorFirstName } = req.body;

        if (!contractorFirstName) {
            return res.status(400).json({
                success: false,
                message: "Contractor first name is required."
            });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        // Ensure the new contractor is valid (not an Admin or IT Admin)
        let contractor = await User.findOne({ email: newContractorEmail });
        if (!contractor || (contractor.role === "Admin" || contractor.role === "IT Admin")) {
            return res.status(400).json({
                success: false,
                message: "The user must be a valid contractor, not an Admin or IT Admin.",
            });
        }

        let isNewContractor = false;

        // If contractor doesn't exist, create a new contractor
        if (!contractor) {
            const hashedPassword = await bcrypt.hash("eagleeye@123", 10);
            const dicebearUrl = generateDicebearImage(contractorFirstName);

            contractor = await User.create({
                firstName: contractorFirstName,
                lastName: "",
                email: newContractorEmail,
                password: hashedPassword,
                role: "Contractor",
                profileImage: dicebearUrl,
                isFirstLogin: true,
            });

            isNewContractor = true;

            // Notify the contractor of account creation
            try {
                await sendEmail(
                    newContractorEmail,
                    "New Contractor Account Created",
                    `
                    <h3>Welcome!</h3>
                    <p>Hello ${contractor.firstName},</p>
                    <p>Your contractor account has been created. Use the default password <strong>"eagleeye@123"</strong> to log in and start managing projects.</p>
                    `
                );
            } catch (emailErr) {
                console.error("Error sending account creation email:", emailErr.message);
            }
        }

        // Update the project with the new contractor
        project.transferHistory.push({
            from: project.assignedContractor,
            to: contractor._id,
            date: new Date(),
        });

        // Update the project and the new contractor's assignedProjects array
        project.assignedContractor = contractor._id;
        contractor.assignedProjects.push(project._id);

        // Remove the project from the old contractor's assignedProjects array
        const oldContractor = await User.findById(project.assignedContractor);
        if (oldContractor) {
            oldContractor.assignedProjects = oldContractor.assignedProjects.filter(
                (assignedProject) => assignedProject.toString() !== projectId
            );
            await oldContractor.save();
        }

        // Save both project and contractor
        await project.save();
        await contractor.save();

        // Notify the new contractor of project assignment
        try {
            await sendEmail(
                newContractorEmail,
                "Project Assignment",
                `
                <h3>Congratulations!</h3>
                <p>Hello ${contractor.firstName},</p>
                <p>You have been assigned to manage the project <strong>"${project.projectName}"</strong>.</p>
                `
            );
        } catch (emailErr) {
            console.error("Error sending project assignment email:", emailErr.message);
        }

        res.status(200).json({
            success: true,
            message: "Project successfully transferred to the new contractor.",
            data: project,
        });
    } catch (err) {
        console.error("Error in editProject:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};



// Other Functions
const getDashboardData = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const completedProjects = await Project.countDocuments({ status: "Completed" });
        const ongoingProjects = await Project.countDocuments({ status: "Under Construction" });
        const totalContractors = await User.countDocuments({ role: "Contractor" });

        res.status(200).json({
            success: true,
            data: {
                totalProjects,
                completedProjects,
                ongoingProjects,
                totalContractors,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const markProjectAsCompleted = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId).populate("phases");
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found." });
        }

        if (project.status === "Completed") {
            return res.status(400).json({ success: false, message: "Project is already completed." });
        }

        const allPhasesCompleted = project.phases.every((phase) => phase.progress === 100);
        if (!allPhasesCompleted || project.progress !== 100) {
            return res.status(400).json({
                success: false,
                message: "All phases must be completed and the project progress must be 100%.",
            });
        }

        project.status = "Completed";
        await project.save();

        res.status(200).json({
            success: true,
            message: "Project marked as completed successfully.",
            data: project,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Reset Contractor Password
const resetContractorPassword = async (req, res) => {
    try {
        const { contractorId } = req.body;

        const contractor = await User.findById(contractorId);
        if (!contractor || contractor.role !== "Contractor") {
            return res.status(404).json({ success: false, message: "Contractor not found." });
        }

        const defaultPassword = "eagleeye@123";
        contractor.password = await bcrypt.hash(defaultPassword, 10);
        await contractor.save();

        res.status(200).json({ success: true, message: "Password reset to default successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createProject,
    editProject,
    getDashboardData,
    deleteProject,
    markProjectAsCompleted,
    resetContractorPassword,
};
