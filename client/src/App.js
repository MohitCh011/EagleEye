import React, { useState ,useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Popup from "./components/Popup/Popup";
import OngoingProjectsPage from "./pages/OngoingProjectsPage";
import CompletedProjectsPage from "./pages/CompletedProjectsPage";
import Navbar from "./components/Navbar/Navbar2";
import ChangePasswordPage from "./components/Auth/ChangePasswordPage";
import Footer from "./components/Footer/Footer";
import ContractorDashboard from "./components/Dashboard/ContractorDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import ITAdminDashboard from "./components/Dashboard/ITAdminDashboard";
import HeroPhase from "./pages/HeroPhase";
import HomePage from "./pages/HomePage";
import InspectorDashboard from "./components/Dashboard/InspectorDashboard";
import ProjectPhasesPage from "./pages/ProjectPhasesPage";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import LoginPage from "./components/Auth/LoginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const [user, setUser] = useState();
 
  const handlePopupClose = () => setIsPopupVisible(false);

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={3000} />
      {isPopupVisible && (
        <Popup
          onClose={handlePopupClose}
          onGuestMode={() => setIsPopupVisible(false)}
          onLogin={() => setIsPopupVisible(false)}
        />
      )}
    
      <div className="main-content">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />
        <Routes>
          <Route path="/inspector/project/:projectId" element={<ProjectPhasesPage />} />
          <Route path="/completed-projects" element={<CompletedProjectsPage />} />
          <Route path="/inspector-dashboard" element={<InspectorDashboard />} />
          <Route path="/ongoing-projects" element={<OngoingProjectsPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/it-admin-dashboard" element={<ITAdminDashboard />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;