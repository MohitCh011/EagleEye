import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#F8F4F3] text-gray-900 py-6  shadow-sm">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-semibold text-[#1C1777] mb-4">
          Team HexaInnovators
        </h2>
        <div className="mt-4">
          <p className="hover:text-[#519beb] hover:cursor-pointer transition duration-300">
            Ch. Mohit
          </p>
          <p className="hover:text-[#519beb] hover:cursor-pointer  transition duration-300">
            D. Akash
          </p>
          <p className="hover:text-[#519beb] hover:cursor-pointer transition duration-300">
            Ch. Sruthi Sree
          </p>
          <p className="hover:text-[#519beb] hover:cursor-pointer  transition duration-300">
            D. Likhitha Sri
          </p>
          <p className="hover:text-[#519beb] hover:cursor-pointer  transition duration-300">
            G. Abhiram
          </p>
          <p className="hover:text-[#519beb] hover:cursor-pointer ] transition duration-300">
            T. Deveswar
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <a href="#" className="text-[#003366] hover:text-[#F35D00]">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-[#003366] hover:text-[#F35D00]">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-[#003366] hover:text-[#F35D00]">
            <i className="fab fa-x"></i>
          </a>
          <a href="#" className="text-[#003366] hover:text-[#F35D00]">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <p className="mt-6 text-xs text-gray-600">
          <strong>NOTE:</strong> This website is best served in the Desktop
          mode, kindly enforce Desktop site on your mobile browsers.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          &copy; 2024-25 Smart India Hackathon. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
