import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const themes = [
  { title: "Road Phase Identification", description: "Identify and assess road phases for better planning and execution.", icon: "🚧" },
  { title: "Utility Duct Installation Monitoring", description: "Monitor the installation of utility ducts to ensure quality and precision.", icon: "📡" },
  { title: "Pedestrian Facility Development", description: "Plan and develop safe pedestrian facilities for urban environments.", icon: "🚶‍♂️" },
  { title: "Pavement Distress Assessment", description: "Assess pavement conditions to ensure long-term durability and safety.", icon: "🛣️" },
  { title: "Traffic Marking Inspection", description: "Inspect traffic markings to ensure clarity and compliance with standards.", icon: "🚦" },
  { title: "Macadamization", description: "Monitor macadamization processes for optimal road surface quality.", icon: "🛤️" },
  { title: "Traffic Island Construction", description: "Develop traffic islands to streamline traffic flow and enhance safety.", icon: "🛑" },
  { title: "Highway Infrastructure Assessment", description: "Evaluate highway infrastructure for maintenance and improvement needs.", icon: "🏗️" },
];

const ThemeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const changeSlide = (direction) => {
    setCurrentIndex((prevIndex) =>
      direction === "next"
        ? (prevIndex + 1) % themes.length
        : (prevIndex - 1 + themes.length) % themes.length
    );
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      changeSlide("next");
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const visibleSlides = [
    themes[currentIndex],
    themes[(currentIndex + 1) % themes.length],
    themes[(currentIndex + 2) % themes.length],
  ];

  return (
    <div
      className="relative bg-gradient-to-r from-orange-50 via-white to-orange-50 p-[50px] rounded-lg w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h2 className="text-center text-orange-700 text-3xl font-extrabold mb-10 tracking-wide">
        TYPES OF ACTIVITY
      </h2>

      <div className="flex items-center justify-between gap-6">
        {/* Left Navigation */}
        <button
          onClick={() => changeSlide("prev")}
          aria-label="Previous Slide"
          className="p-3 rounded-full bg-orange-100 hover:bg-orange-300 text-orange-700 focus:ring-4 focus:ring-orange-400 transition-transform transform hover:scale-110"
        >
          <FaChevronLeft size={24} />
        </button>

        {/* Slide Container */}
        <div className="flex-1 flex gap-6 justify-center overflow-hidden">
          {visibleSlides.map((theme, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: index === 1 ? 1 : 0.95, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -50 }}
              transition={{ duration: 0.6 }}
              className={`p-8 bg-white rounded-lg shadow-lg text-center border-t-4 w-[30%] 
              ${
                index === 1
                  ? "border-orange-600 transform scale-105"
                  : "border-gray-300"
              }`}
            >
              <div className="text-6xl mb-5 transition-transform transform hover:scale-110">
                {theme.icon}
              </div>
              <h3
                className={`text-xl font-semibold ${
                  index === 1 ? "text-orange-700" : "text-blue-900"
                } mb-3`}
              >
                {theme.title}
              </h3>
              <p className="text-gray-600 text-base">{theme.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Right Navigation */}
        <button
          onClick={() => changeSlide("next")}
          aria-label="Next Slide"
          className="p-3 rounded-full bg-orange-100 hover:bg-orange-300 text-orange-700 focus:ring-4 focus:ring-orange-400 transition-transform transform hover:scale-110"
        >
          <FaChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ThemeCarousel;
