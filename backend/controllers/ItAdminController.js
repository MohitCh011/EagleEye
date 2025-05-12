const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const generateDicebearImage = require("../utils/generateDicebearImage");
// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        // Fetch the IT Admin's profile using the token's user id
        const admin = await User.findById(req.user.id).select("firstName");

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        // Fetch all other admins
        const admins = await User.find({ role: "Admin" }).select(
            "firstName lastName email contactNumber profileImage"
        );

        res.status(200).json({
            success: true,
            data: {
                loggedInAdmin: admin.firstName,  // Include the first name of the logged-in IT Admin
                admins,  // Include all admins
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



// Add a new admin
const addAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exists." });
        }

        // Generate profile image URL using Dicebear
        const profileImage = generateDicebearImage(firstName); // Generate image URL based on the first name

        const defaultPassword = "admin@123";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        // Create a new admin user
        const newAdmin = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "Admin",
            contactNumber,
            profileImage, // Add the generated profile image URL
            isFirstLogin: true,
        });

        // Send an email to the new admin with the default password
        await sendEmail(
            email,
            "Admin Account Created",
            `
            <h3>Welcome to the IT Admin Team!</h3>
            <p>Your admin account has been created with the default password <strong>${defaultPassword}</strong>.</p>
            <p>Please change your password upon first login.</p>
            `
        );

        res.status(201).json({
            success: true,
            message: "Admin created successfully.",
            data: newAdmin,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// Delete an admin
const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "Admin") {
            return res.status(404).json({ success: false, message: "Admin not found." });
        }

        await User.findByIdAndDelete(adminId);

        res.status(200).json({
            success: true,
            message: "Admin deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Reset an admin's password
const resetAdminPassword = async (req, res) => {
    try {
        const { adminId } = req.body;

        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "Admin") {
            return res.status(404).json({ success: false, message: "Admin not found." });
        }

        const defaultPassword = "admin@123";
        admin.password = await bcrypt.hash(defaultPassword, 10);
        admin.isFirstLogin = true;
        await admin.save();

        res.status(200).json({ success: true, message: "Admin password reset to default successfully." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    getAllAdmins,
    addAdmin,
    deleteAdmin,
    resetAdminPassword,
};
