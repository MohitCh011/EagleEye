import React, { useState, useEffect } from "react";
import helper1 from "../assets/banner/1.jpg";
import helper2 from "../assets/banner/2.jpg";
import helper3 from "../assets/banner/3.jpg";
import helper4 from "../assets/banner/4.jpg";

const images = [helper1, helper2, helper3, helper4];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle previous slide click
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Handle next slide click
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Automatically scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(handleNext, 3000); // 3 seconds interval
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <div
      className="relative mx-auto overflow-hidden bg-[#F8F4F3] rounded-lg shadow-lg"
      style={{ width: "75vw", maxHeight: "600px", height: "auto" }}
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-500"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          maxHeight: "600px", // Set max height for carousel
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="min-w-full h-full flex items-center justify-center"
            style={{
              maxHeight: "650px", // Ensure each image doesn't exceed the max height
            }}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ maxHeight: "650px", objectFit: "cover" }} // Ensure image fits within max height
            />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-200"
        aria-label="Previous Slide"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow hover:bg-gray-200"
        aria-label="Next Slide"
      >
        ❯
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-gray-800" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;