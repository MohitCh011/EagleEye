const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent, from = process.env.EMAIL_USER) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from,
            to: to === '' ? 'eagleeye8886@gmail.com' : to,
            subject,
            html: htmlContent,
        };
        

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Error sending email:", err.message);
        throw new Error("Email sending failed");
    }
};

module.exports = sendEmail;
