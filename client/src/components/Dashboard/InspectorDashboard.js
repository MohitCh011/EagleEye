import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { toast } from "react-toastify";
import { FaUserCog } from "react-icons/fa";
import EditProfileModal from "../Modals/EditProfileModal";

const InspectorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("home"); // For sidebar navigation
  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get("/inspector/dashboard");
        setDashboardData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data!");
      }
    };

    const fetchAssignedProjects = async () => {
      try {
        const response = await API.get("/inspector/projects");
        setProjects(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch assigned projects!");
        console.error("Error fetching assigned projects:", error);
      }
    };

    const fetchProfileData = async () => {
      try {
        const response = await API.get("/profile/getdetails");
        setProfileData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch profile data!");
        console.error("Error fetching profile data:", error);
      }
    };

    fetchDashboardData();
    fetchAssignedProjects();
    fetchProfileData();
  }, []);

  // Handle profile update
  const handleProfileUpdated = (updatedProfile) => {
    setProfileData(updatedProfile);
    setIsEditModalOpen(false);
  };

  // Sidebar navigation handler
  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  return (
    <div>  
       <div className="topbar text-center md:hidden">
       <ul className="flex justify-center w-full space-x-4">
          <li
            className={`cursor-pointer p-3 rounded-lg ${
              currentView === "home" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
            onClick={() => handleNavigation("home")}
          >
            Home
          </li>
          <li
            className={`cursor-pointer p-3 rounded-lg ${
              currentView === "assignedProjects"
                ? "bg-gray-600"
                : "hover:bg-gray-700"
            }`}
            onClick={() => handleNavigation("assignedProjects")}
          >
            Assigned Projects
          </li>
        </ul>
      </div>
       
      
      
       <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-65 bg-gray-800 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">Inspector Dashboard</h2>
        <ul className="space-y-4">
          <li
            className={`cursor-pointer p-3 rounded-lg ${
              currentView === "home" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
            onClick={() => handleNavigation("home")}
          >
            Home
          </li>
          <li
            className={`cursor-pointer p-3 rounded-lg ${
              currentView === "assignedProjects"
                ? "bg-gray-600"
                : "hover:bg-gray-700"
            }`}
            onClick={() => handleNavigation("assignedProjects")}
          >
            Assigned Projects
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {currentView === "home" && (
          <>
            {/* Profile Section */}
            <div className="flex flex-col max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col items-center bg-orange-300 text-white p-6 rounded-lg mb-6">
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
                className="bg-orange-200 text-red-900 py-2 px-4 rounded-md hover:bg-orange-400 transition duration-200 ease-in-out"
              >
                <FaUserCog className="inline-block mr-2" />
                Edit Profile
              </button>
            </div>
            {/* <div className="w-full">
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
          </>
        )}

        {currentView === "assignedProjects" && (
        <>
        {/* Assigned Projects */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Your Assigned Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-2xl"
              onClick={() => navigate(`/inspector/project/${project.id}`)}
            >
              <h3 className="text-xl font-bold text-white mb-2">{project.projectName}</h3>
              <p className="text-sm text-gray-200">Click to view phases</p>
            </div>
          ))}
        </div>
      </>
      
        )}

        {isEditModalOpen && (
          <EditProfileModal
            profile={profileData}
            onClose={() => setIsEditModalOpen(false)}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </main>
    </div>
    </div>

  );
};

export default InspectorDashboard;
