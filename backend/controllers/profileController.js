const User = require("../models/User");
const Project = require("../models/Project");
const uploadImageToCloudinary = require("../utils/cloudinaryUploader"); // Ensure correct path to Cloudinary uploader
const multer = require('multer');  // Import multer here
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files

const updateProfile = async (req, res) => {

    try {
        const updates = {};

        if (req.file) {
            try {
                const uploadedImage = await uploadImageToCloudinary(req.file.path, 'profiles');
                updates.profileImage = uploadedImage.url;
            } catch (err) {
                console.error("Error uploading image to Cloudinary:", err);
                return res.status(500).json({ success: false, message: "Image upload failed" });
            }
        }

        if (req.body.contactNumber) {
            updates.contactNumber = req.body.contactNumber;
        }

        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("firstName lastName email role profileImage contactNumber");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error("Error in updateProfile:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};


// Fetch User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            "firstName lastName email role profileImage assignedProjects"
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let userDetails = { ...user._doc };

        // If Inspector, fetch assigned projects
        if (user.role === "Inspector") {
            const assignedProjects = await Project.find({ assignedInspectors: user._id }).select(
                "projectName budget status startCoordinates endCoordinates"
            );
            const createdPhasesCount = await User.countDocuments({ createdBy: user._id });

            userDetails.createdPhasesCount = createdPhasesCount;
            userDetails.assignedProjects = assignedProjects;
        }

        // If Contractor, fetch projects they manage
        if (user.role === "Contractor") {
            const managedProjects = await Project.find({ assignedContractor: user._id }).select(
                "projectName budget status startCoordinates endCoordinates assignedInspectors"
            );
            const createdUsersCount = await User.countDocuments({ createdBy: user._id });

            userDetails.createdUsersCount = createdUsersCount;
            userDetails.managedProjects = managedProjects;
        }

        // If Admin, fetch all created projects
        if (user.role === "Admin") {
            const createdProjects = await Project.find({}).select(
                "projectName budget status startCoordinates endCoordinates assignedContractor"
            );
            const createdUsersCount = await User.countDocuments({ createdBy: user._id });

            userDetails.createdUsersCount = createdUsersCount;
            userDetails.createdProjects = createdProjects;
        }
        if (user.role === "IT Admin") {
            // Assuming 'createdBy' is a field in the User model that tracks the creator of each user.
            const createdUsersCount = await User.countDocuments({ createdBy: user._id });

            userDetails.createdUsersCount = createdUsersCount;
        }
        res.status(200).json({ success: true, data: userDetails });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Contact IT Developer for Password Change (Admin Only)
const contactIT = async (req, res) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    res.status(200).json({
        success: true,
        message: "Contact IT Developer: Email - eagleeye8886@gmail.com",
    });
};

// Contact Admin for Password Change (Contractor Only)
const contactAdmin = async (req, res) => {
    if (req.user.role !== "Contractor") {
        return res.status(403).json({ success: false, message: "Access denied. Contractors only." });
    }

    try {
        // Find an admin in the database
        const admin = await User.findOne({ role: "Admin" }).select("email");
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found. Please contact support.",
            });
        }

        res.status(200).json({
            success: true,
            message: `Contact Admin: Email - ${admin.email}`,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    contactIT,
    contactAdmin,
};
