import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../utils/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar/Navbar";
const ContactUs = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Make API request
      const response = await API.post("/contact-us", data);

      // Check response and show success toast
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        reset(); // Clear form after successful submission
      } else {
        toast.error("Failed to send the message.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred!",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4F3] py-10">
      <motion.div
        className="flex flex-col lg:flex-row gap-8 w-11/12 max-w-screen-xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Contact Details Section (Left Side) */}
        <motion.div
          className="w-full lg:w-[35%] bg-white p-8 rounded-lg shadow-xl h-[500px] lg:mt-16"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-[#F35D00] mb-6">Contact Details</h2>
          <div className="flex flex-col gap-6">
            {/* Contact Detail - Chat */}
            <motion.div
              className="flex items-start gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-2xl text-[#F35D00]">💬</span>
              <div>
                <h3 className="font-semibold text-lg text-[#F35D00]">Chat on us</h3>
                <p className="text-gray-600">Our friendly team is here to help.</p>
                <p className="font-semibold text-gray-800">eagleEye@pvpsit.com</p>
              </div>
            </motion.div>
            {/* Contact Detail - Visit */}
            <motion.div
              className="flex items-start gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-2xl text-[#F35D00]">🌍</span>
              <div>
                <h3 className="font-semibold text-lg text-[#F35D00]">Visit us</h3>
                <p className="text-gray-600">Come and say hello at our office HQ.</p>
                <p className="font-semibold text-gray-800">
                  PVPSIT, Kanuru, Vijayawada, AndhraPradesh-520012
                </p>
              </div>
            </motion.div>
            {/* Contact Detail - Call */}
            <motion.div
              className="flex items-start gap-3"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-2xl text-[#F35D00]">📞</span>
              <div>
                <h3 className="font-semibold text-lg text-[#F35D00]">Call us</h3>
                <p className="text-gray-600">Mon - Fri from 8am to 5pm</p>
                <p className="font-semibold text-gray-800">+123 456 7869</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Form Section (Right Side) */}
        <motion.div
          className="w-full lg:w-[60%] bg-white p-8 rounded-lg shadow-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-semibold text-center text-[#F35D00] mb-8">
            Got a Idea? Let&apos;s team up!
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Tell us more about yourself and what you&apos;ve got in mind.
          </p>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="mb-4">
              <label className="block text-[#F35D00] font-medium mb-2">
                First Name
              </label>
              <motion.input
                {...register("firstName", { required: true })}
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                placeholder="Enter your first name"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F35D00] font-medium mb-2">
                Last Name
              </label>
              <motion.input
                {...register("lastName")}
                type="text"
               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                placeholder="Enter your last name"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F35D00] font-medium mb-2">
                Email Address
              </label>
              <motion.input
                {...register("email", { required: true })}
                type="email"
               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                placeholder="Enter your email address"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F35D00] font-medium mb-2">
                Phone Number
              </label>
              <motion.input
                {...register("phoneNumber")}
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                placeholder="Enter your phone number"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-[#F35D00] font-medium mb-2">
                Message
              </label>
              <motion.textarea
                {...register("message", { required: true })}
                rows="4"
               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-300"
                placeholder="Enter your message"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              ></motion.textarea>
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-4 py-2 bg-[#F35D00] text-white rounded-lg font-semibold transition duration-300 ${
                isSubmitting ? "opacity-50" : "hover:bg-[#F35D00]"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {isSubmitting ? "Submitting..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div></>
  );
};

export default ContactUs;
