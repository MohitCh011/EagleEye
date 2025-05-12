import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa"; // Import the arrow icon
import "./Navbar.css"
const Navbar = ({ isLoggedIn, user }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // Track scroll state

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Listen for scroll events to toggle the shadow class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
  };

  return (
    <nav className={`navbar ${scrolled ? "shadow-lg" : ""}`}> {/* Apply shadow on scroll */}
      <div className="navbar-container rounded-t-lg font-sans">
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
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <div
                  className="user-profile"
                  onClick={() => navigate("/dashboard")}
                >
                  <img
                    src={user.profileImage || "/default-profile.png"}
                    alt="User"
                    className="user-avatar"
                  />
                  <span>{user.firstName}</span>
                </div>
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

       {/* Scroll to Top Button */}
       {scrolled && (
        <button
          className="scroll-to-top fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-md hover:bg-orange-600"
          onClick={scrollToTop}
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </nav>
  );
};

export default Navbar;