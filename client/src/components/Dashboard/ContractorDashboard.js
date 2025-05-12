import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";
import ContractorMetricsChart from "../Charts/ContractorMetricsChart";
import ContractorProjectCard from "../Cards/ContractorProjectCard";
import AddInspectorForm from "../Forms/AddInspectorForm";
import EditProfileModal from "../Modals/EditProfileModal";


import { FaHome, FaProjectDiagram, FaUserCog } from "react-icons/fa";

const ContractorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isAddInspectorFormOpen, setIsAddInspectorFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get("/contractor/dashboard");
        setDashboardData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data!");
      }
    };

    const fetchProfileData = async () => {
      try {
        const response = await API.get("/profile/getdetails");
        setProfileData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch profile data!");
      }
    };
    

    const fetchAssignedProjects = async () => {
      try {
        const response = await API.get("/contractor/projects");
        setProjects(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch assigned projects!");
      }
    };

    fetchDashboardData();
    fetchProfileData();
    fetchAssignedProjects();
  }, []);

  const handleInspectorAdded = (updatedProject) => {
    setProjects((prev) =>
      prev.map((project) =>
        project._id === updatedProject._id ? updatedProject : project
      )
    );
  };

  const handleProfileUpdated = (updatedProfile) => {
    setProfileData(updatedProfile);
    setIsEditModalOpen(false);
  };
 

  const renderViewContent = () => {
    switch (currentView) {
      case "home":
        return (
          <div className="w-full md:w-3/4 px-6 py-8">
            {/* Profile Section */}
            <div className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg gap-6">
              <div className="flex flex-col items-center bg-orange-300 text-white p-6 rounded-lg w-full mb-6">
                <img
                  src={profileData?.profileImage || "https://www.gravatar.com/avatar/?d=mp"}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover mb-4"
                />
                <h2 className="text-xl font-bold">
                  {profileData?.firstName} {profileData?.lastName}
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className=" bg-orange-200 text-red-900 py-2 px-4 rounded-md hover:bg-orange-400 transition duration-200 ease-in-out"
                >
                  <FaUserCog className="inline-block mr-2" />
                  Edit Profile
                </button>
              </div>
              {/* Right Side Content */}
  {/* <div className="lg:w-2/3 w-full">
    <div className="pb-4 mb-6 border-2 border-gray-300 rounded-lg p-6">
      <h3 className="text-2xl font-semibold mb-2">Details</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex justify-between text-sm border-b border-gray-200 pb-2 mb-2">
          <span className="font-bold">HallTicket No.</span>
          <span>{profileData?.hallTicketNo}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-gray-200 pb-2 mb-2">
          <span className="font-bold">Programme</span>
          <span>{profileData?.programme}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-gray-200 pb-2 mb-2">
          <span className="font-bold">Regulation</span>
          <span>{profileData?.regulation}</span>
        </div>
        <div className="flex justify-between text-sm border-b border-gray-200 pb-2 mb-2">
          <span className="font-bold">Branch</span>
          <span>{profileData?.branch}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-bold">Section</span>
          <span>{profileData?.section}</span>
        </div>
      </div>
    </div>
  </div> */}
              </div>
              {/* Metrics Section */}
              <h1 className="text-3xl font-bold text-center mt-8 mb-8">Dashboard Metrics</h1>
              {dashboardData && (
                <div className="grid grid-cols-1 gap-6 justify-items-center items-center mx-auto">
                  <ContractorMetricsChart metrics={dashboardData} />
                </div>
              )}
         
            
          </div>
        );

      case "assignedProjects":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Assigned Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                
                <ContractorProjectCard
                  key={project._id}
                  project={project}
                  onAddInspector={() => {
                    setSelectedProject(project);
                    setIsAddInspectorFormOpen(true);
                  }}
               />
              
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="topbar text-center md:hidden">
        <ul className="flex justify-center w-full space-x-4">
          {/* Home Button */}
          <li
                className={`p-3 cursor-pointer ${
                  currentView === "home" ? "bg-gray-700" : ""
                }`}
                onClick={() => setCurrentView("home")}
              >
                <FaHome className="inline-block mr-2" />
                Home
              </li>
          {/* Projects Button */}
      

          {/* Create Project Button */}
          <li
                className={`p-3 cursor-pointer ${
                  currentView === "assignedProjects" ? "bg-gray-700" : ""
                }`}
                onClick={() => setCurrentView("assignedProjects")}
              >
                <FaProjectDiagram className="inline-block mr-2" />
                Assigned Projects
              </li>
        </ul>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-65 bg-gray-800 text-white p-6 hidden md:block">
          <h2 className="text-xl font-bold mb-4">Contractor Dashboard</h2>
          <nav>
            <ul>
              <li
                className={`p-3 cursor-pointer ${
                  currentView === "home" ? "bg-gray-700" : ""
                }`}
                onClick={() => setCurrentView("home")}
              >
                <FaHome className="inline-block mr-2" />
                Home
              </li>
              <li
                className={`p-3 cursor-pointer ${
                  currentView === "assignedProjects" ? "bg-gray-700" : ""
                }`}
                onClick={() => setCurrentView("assignedProjects")}
              >
                <FaProjectDiagram className="inline-block mr-2" />
                Assigned Projects
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100">
          {renderViewContent()}

          {/* Add Inspector Form */}
          {isAddInspectorFormOpen && selectedProject && (
            <AddInspectorForm
              project={selectedProject}
              onClose={() => setIsAddInspectorFormOpen(false)}
              onInspectorAdded={handleInspectorAdded}
            />
          )}

          {/* Edit Profile Modal */}
          {isEditModalOpen && (
            <EditProfileModal
              profile={profileData}
              onClose={() => setIsEditModalOpen(false)}
              onProfileUpdated={handleProfileUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
