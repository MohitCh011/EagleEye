import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa"; // Import the arrow icon

import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn, user }) => {
  const routeMap = {
    Admin: "/admin-dashboard",
    Contractor: "/contractor-dashboard",
    Inspector: "/inspector-dashboard",
    "IT Admin": "/it-admin-dashboard",
  };
  const role=localStorage.getItem("userRole");
  const userImg=localStorage.getItem("userImage");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Update isLoggedIn state
    navigate("/");
  };

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex">
      <nav className="navbar w-full">
        <motion.div
          className="navbar-container"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="navbar-brand">
            <Link to="/" className="navbar-logo">
              <span className="navbar-logo-text">Eagle </span>
              <span className="navbar-logo-highlight">Eye</span>
            </Link>
          </div>
          <div className="navbar-menu">
            <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li>
                <Link to="/about-us" className="nav-link">About Us</Link>
              </li>
              <li>
                <Link to="/ongoing-projects" className="nav-link">Ongoing Projects</Link>
              </li>
              <li>
                <Link to="/completed-projects" className="nav-link">Completed Projects</Link>
              </li>
              <li>
                <Link to="/contact-us" className="nav-link">Contact Us</Link>
              </li>
              {!isLoggedIn ? (
                <li>
                  <Link to="/login" className="login-btn">Login</Link>
                </li>
              ) : (
                <li>
                  <div className="flex">
                  <div
                      className="user-profile"
                      onClick={() => navigate(routeMap[role] || "/")}
                    >
                      <img
                        src={userImg || "https://www.gravatar.com/avatar/?d=mp"}
                        alt="User"
                        className="user-avatar"
                      />
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      </nav>

      <div className="ss">
        <button
          className="menu-toggle ml-auto hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {showScrollButton && (
         <button
         className="scroll-to-top fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-md hover:bg-orange-600"
         onClick={scrollToTop}
       >
         <FaArrowUp size={20} />
       </button>
      )}
    </div>
  );
};

export default Navbar;
