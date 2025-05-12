import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import API from "../../utils/api";

const LoginPage = ({ setIsLoggedIn, setUser }) => {
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await API.post("/auth/login", data);

      const { role, token, redirect, success, message, user } = response.data;
      if (token) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userImage", user.profileImage);
      }

      if (success) {
        setUser(user);
        setIsLoggedIn(true);
        if (redirect) {
          toast.info(message || "First login detected! Redirecting to change password...");
          navigate(redirect);
        } else {
          toast.success(message || "Login successful!");
          const routeMap = {
            Admin: "/admin-dashboard",
            Contractor: "/contractor-dashboard",
            Inspector: "/inspector-dashboard",
            "IT Admin": "/it-admin-dashboard",
          };
          navigate(routeMap[role] || "/");
        }
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4F3] py-12">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-semibold mb-4 text-center text-[#F35D00]">
          Welcome Back!
        </h1>
        <h2 className="text-xl font-medium mb-6 text-center text-gray-800">
          Enter your credentials
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
          <motion.label
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p className="mb-1 text-sm text-gray-700">Email Address</p>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg outline-none focus:outline-none focus:border-orange-300"
            />
          </motion.label>
          <motion.label
            className="relative w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="mb-1 text-sm text-gray-700">Password</p>
            <input
              {...register("password", { required: true })}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-3 border rounded-lg outline-none focus:outline-none focus:border-orange-300"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </motion.label>
          <motion.p
            onClick={handleForgotPassword}
            className="text-xs text-orange-900 text-right cursor-pointer hover:underline"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Forgot your password?
          </motion.p>
          <motion.button
            type="submit"
            className={`mt-4 w-full p-3 text-white rounded-lg ${
              isSubmitting
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
