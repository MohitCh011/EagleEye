import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../utils/api";
import { motion } from "framer-motion";

const AddAdminForm = ({ onClose, onAdminAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/it-admin/admins/createadmin", formData);
      toast.success("Admin added successfully!");
      onAdminAdded(response.data.data); // Notify parent of the new admin
      setFormData({ firstName: "", lastName: "", email: "", contactNumber: "" });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display specific error message from the backend
        toast.error(error.response.data.message || "Failed to add admin.");
      } else {
        // Display generic error message for other issues
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4F3] py-12">
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-semibold mb-4 text-center text-[#F35D00]">
          Add New Admin
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          {/* First Name */}
          <motion.label
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <p className="mb-1 text-sm text-gray-700">First Name</p>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="w-full p-3 border rounded-lg outline-none focus:outline-none focus:border-orange-300"
              required
            />
          </motion.label>
          {/* Last Name */}
          <motion.label
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="mb-1 text-sm text-gray-700">Last Name</p>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="w-full p-3 border rounded-lg outline-none focus:outline-none focus:border-orange-300"
            />
          </motion.label>
          {/* Email */}
          <motion.label
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="mb-1 text-sm text-gray-700">Email</p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full p-3 border rounded-lg outline-none focus:outline-none focus:border-orange-300"
              required
            />
          </motion.label>
          {/* Contact Number */}
          <motion.label
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <p className="mb-1 text-sm text-gray-700">Contact Number</p>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="w-full p-3 border rounded-lg outline-none focus:outline-none focus:border-orange-300"
            />
          </motion.label>
          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`mt-4 w-full p-3 text-white rounded-lg ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? "Adding..." : "Add Admin"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddAdminForm;
