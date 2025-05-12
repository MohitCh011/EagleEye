import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Popup = ({ onClose, onGuestMode, onLogin }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Check if the popup has already been shown
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");

    if (!hasSeenPopup) {
      setIsVisible(true);
      sessionStorage.setItem("hasSeenPopup", "true");

      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 text-xl">
            ✕
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Our Website!</h2>
          <p className="text-sm mb-6">Explore as a guest or log in to access personalized features.</p>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              onClick={onGuestMode}
            >
              Guest Mode
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              onClick={onLogin}
            >
              Login
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Popup;
