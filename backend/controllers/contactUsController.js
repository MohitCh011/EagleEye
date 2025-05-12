const sendEmail = require("../utils/sendEmail");

const contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, message, phoneNumber } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const subject = "Contact Us Form Submission";
        const htmlContent = `
            <h3>Contact Form Details</h3>
            <p><strong>First Name:</strong> ${firstName}</p>
            <p><strong>Last Name:</strong> ${lastName || "N/A"}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phoneNumber || "N/A"}</p>
            <p><strong>Message:</strong> ${message}</p>
        `;

        // Send the email from the user's email address
        await sendEmail('', subject, htmlContent, true);

        res.status(200).json({
            success: true,
            message: "Your message has been sent successfully. We will get back to you shortly.",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Notify Contractor or Inspector
const notifyUser = async (userEmail, role, projectName) => {
    try {
        const subject = `${role} Assignment Notification`;
        const htmlContent = `
            <h3>Congratulations!</h3>
            <p>Hello,</p>
            <p>You have been assigned as a ${role.toLowerCase()} for the project <strong>${projectName}</strong>.</p>
            <p>Please log in to your account to manage this project.</p>
        `;

        await sendEmail(userEmail, subject, htmlContent);

        console.log(`Notification sent to ${role}: ${userEmail}`);
    } catch (err) {
        console.error(`Error notifying ${role}:`, err.message);
    }
};

module.exports = {
    contactUs,
    notifyUser,
};
