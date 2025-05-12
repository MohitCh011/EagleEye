import React, { useRef } from "react";
import Flow from "../assets/flow.png";

const HomePage2 = () => {
  const videoRef = useRef(null);

  const handleMouseEnter = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        console.log("Video is playing on hover.");
      } catch (error) {
        console.error("Error trying to play the video:", error);
      }
    }
  };

  return (
    <>
      <div className="relative w-full h-auto bg-[#F8F4F3] flex items-center justify-center outline-none">
        {/* Video Section */}
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dwzyaplhg/video/upload/v1733746897/egaleeyehelpervid_gggzkx.mp4"
          className="w-full h-auto max-h-auto object-contain z-0"
          muted
          onMouseEnter={handleMouseEnter} // Play video when cursor touches
          onMouseLeave={() => videoRef.current?.pause()} // Pause video when cursor leaves
          playsInline
          loop={false} // Ensure it doesn't loop
          style={{ outline: "none", border: "none" }}
          controls={false} // Hide controls
        ></video>
      </div>

      <div className="flex justify-center mt-8">
        <img
          src={Flow}
          alt="Flow"
          className="object-cover" // Ensure the image scales to its original size
        />
      </div>
    </>
  );
};

export default HomePage2;
