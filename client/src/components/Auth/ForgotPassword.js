import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import { IoArrowBackSharp } from "react-icons/io5";
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await API.post("/auth/send-otp", { email });
      toast.success(response.data.message);
      setOtpModalOpen(true); // Open OTP input modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/auth/change-password", {
        email,
        otp,
        newPassword,
      });
      toast.success(response.data.message);
      navigate("/login"); // Redirect to login page after password change
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password.");
    }
  };

  const handleBackClick = () => {
    if (otpModalOpen) {
      setOtpModalOpen(false); // Go back to the email input page
    } else {
      navigate("/login"); // Redirect to the login page if in the email page
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4F3] py-12">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={handleBackClick}
          className="absolute top-20 left-4 text-[#F35D00] font-semibold m-4"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
         <div className="flex gap-2 items-center"> <IoArrowBackSharp /> Go Back</div>
        </motion.button>

        <h1 className="text-3xl font-semibold mb-6 text-center text-[#F35D00]">
          Forgot Password
        </h1>

        {!otpModalOpen ? (
          <motion.form
            onSubmit={handleEmailSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#F35D00] text-white px-4 py-2 rounded-lg ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F35D00]"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            onSubmit={handleOtpSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="w-full bg-[#F35D00] text-white px-4 py-2 rounded-lg hover:bg-[#F35D00]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Change Password
            </motion.button>
          </motion.form>
        )}
      </motion.div>
    </div>
    </> 
  );
};

export default ForgotPasswordPage;
