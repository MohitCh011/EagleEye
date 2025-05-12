const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenUtils");
const sendEmail = require("../utils/sendEmail");

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    // First login detection (Inspector or Contractor)
    if (user.isFirstLogin) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to database
      await OTP.create({ email: user.email, otp });

      // Send OTP email
      const subject = "OTP for First Login Password Change";
      const message = `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;
      await sendEmail(user.email, subject, message);

      return res.status(200).json({
        success: true,
        message: "First login detected. OTP sent to your email for password change.",
        redirect: "/change-password",
        token: generateToken(user), // Provide token to allow `/change-password` page access
        role: user.role,
      });
    }

    // Generate token for standard login
    const token = generateToken(user);

    res.cookie("token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle OTP validation and password update
    const validOtp = await OTP.findOne({ email, otp });
    if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isFirstLogin = false; // Mark first login as completed
    await user.save();

    // Remove OTP after use
    await OTP.deleteOne({ email, otp });

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Send OTP
const sendOtp = async (req, res) => {
    try {
      const { email } = req.body;
       console.log(email);
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Restrict OTP generation for Contractors and Admins
      if (user.role === "Contractor") {
        return res.status(404).json({
          success: false,
          message: "Contractors cannot change their password. Please contact the admin for a reset.",
        });
      }
  
      if (user.role === "Admin") {
        return res.status(404).json({
          success: false,
          message: "Admins cannot change their password. Please contact IT for a reset.",
        });
      }
  
      // Generate OTP for other roles (Inspector, etc.)
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.create({ email, otp });
  
      // Send OTP email
      const subject = "OTP for Password Reset";
      const message = `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;
      await sendEmail(email, subject, message);
  
      res.status(200).json({ success: true, message: "OTP sent to your email" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  

// Logout
const logout = (req, res) => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};

module.exports = {
  login,
  logout,
  changePassword,
  sendOtp,

};
