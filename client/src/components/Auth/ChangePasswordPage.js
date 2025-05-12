import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const response = await API.post("/auth/change-password", data);
      toast.success(response.data.message || "Password changed successfully!");

      // Clear local storage and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-center">Change Password</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">OTP</label>
            <input
              {...register("otp", { required: true })}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter the OTP"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">New Password</label>
            <input
              {...register("newPassword", { required: true })}
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter new password"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              } transition duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
