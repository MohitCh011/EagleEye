import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import { toast } from "react-toastify";
import CreateProjectForm from "../Forms/CreateProjectForm";
import ConfirmActionModal from "../Modals/ConfirmActionModal";
import ProjectCard from "../Cards/ProjectCard";
import ProjectMetricsChart from "../Charts/ProjectMetricsChart";
import EditProjectForm from "../Forms/EditProjectForm";
import EditProfileModal from "../Modals/EditProfileModal"; // Import the EditProfileModal


// Import icons from React Icons
import { FaHome, FaProjectDiagram, FaPlusCircle, FaUserCog } from "react-icons/fa";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state for profile
  const [profileData, setProfileData] = useState();
  const [currentView, setCurrentView] = useState("home"); // Controls the view: 'home' or 'projects'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get("/admin/dashboard");
        setDashboardData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch dashboard data!");
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await API.get("/projects/ongoing");
        setProjects(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch projects!");
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await API.get("/profile/getdetails");

        console.log(response.data.data);
        setProfileData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch profile data!");
      }
    };

    fetchDashboardData();
    fetchProjects();
    fetchProfile();
  }, []);

  const handleAction = async () => {
    try {
      if (actionType === "delete") {
        await API.delete(`/admin/delete-project/${selectedProject._id}`);
        toast.success("Project deleted successfully!");
        setProjects((prev) =>
          prev.filter((project) => project._id !== selectedProject._id)
        );
      }
    } catch (error) {
      toast.error("Action failed! Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleProfileUpdated = (updatedProfile) => {
    setProfileData(updatedProfile);
    setIsEditModalOpen(false); // Close the modal after update
  };

  return (
    <div>
      
      <div className="topbar text-center md:hidden">
        <ul className="flex justify-center w-full space-x-4">
          {/* Home Button */}
          <li
            className={`p-4 cursor-pointer hover:bg-orange-600 ${
              currentView === "home" ? "bg-orange-600" : ""
            }`}
            onClick={() => setCurrentView("home")}
          >
            <FaHome className="inline-block mr-2" />
            Home
          </li>

          {/* Projects Button */}
          <li
            className={`p-4 cursor-pointer hover:bg-orange-600 ${
              currentView === "projects" ? "bg-orange-600" : ""
            }`}
            onClick={() => setCurrentView("projects")}
          >
            <FaProjectDiagram className="inline-block mr-2" />
            All Projects
          </li>

          {/* Create Project Button */}
          <li
            className={`p-4 cursor-pointer hover:bg-blue-600 ${
              currentView === "addProject" ? "bg-blue-600" : ""
            }`}
            onClick={() => setIsCreateFormOpen(true)}
          >
            <FaPlusCircle className="inline-block mr-2" />
            Create Project
          </li>
        </ul>
      </div>

      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-blue-800 text-white shadow-lg hidden md:block">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
            <ul className="space-y-4">
              {/* Home Button */}
              <li
                className={`p-4 cursor-pointer hover:bg-orange-600 ${
                  currentView === "home" ? "bg-orange-600" : ""
                }`}
                onClick={() => setCurrentView("home")}
              >
                <FaHome className="inline-block mr-2" />
                Home
              </li>

              {/* Projects Button */}
              <li
                className={`p-4 cursor-pointer hover:bg-orange-600 ${
                  currentView === "projects" ? "bg-orange-600" : ""
                }`}
                onClick={() => setCurrentView("projects")}
              >
                <FaProjectDiagram className="inline-block mr-2" />
                All Projects
              </li>

              {/* Create Project Button */}
              <li
                className={`p-4 cursor-pointer hover:bg-blue-600 ${
                  currentView === "addProject" ? "bg-blue-600" : ""
                }`}
                onClick={() => setIsCreateFormOpen(true)}
              >
                <FaPlusCircle className="inline-block mr-2" />
                Create Project
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 px-6 py-8">
    {currentView === "home" && (
 <>
 <div className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg gap-6">
  {/* Left Side Profile Section */}
  <div className="flex flex-col items-center bg-orange-300 text-white p-6 rounded-lg lg:w-1/3 w-full">
    <img
      src={profileData?.profileImage || "https://www.gravatar.com/avatar/?d=mp"}
      alt="Profile"
      className="w-32 h-32 rounded-lg object-cover mb-4"
    />
    <h2 className="text-xl font-bold">
      {profileData?.firstName} {profileData?.lastName}
    </h2>
    <div className="mt-4">
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="w-full bg-orange-200 text-red-900 py-2 px-4 rounded-md hover:bg-orange-400 transition duration-200 ease-in-out"
      >
        <FaUserCog className="inline-block mr-2" />
        Edit Profile
      </button>
    </div>
  </div>

  {/* Right Side Content */}
  <div className="lg:w-2/3 w-full">
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
  </div>
</div>


 <h1 className="text-3xl font-bold text-center mt-8 mb-8">Dashboard Metrics</h1>
 {dashboardData && (
   <div className="grid grid-cols-1 gap-6 justify-items-center items-center mx-auto">
     <ProjectMetricsChart metrics={dashboardData} />
   </div>
 )}
</>

 
    )}

    {currentView === "projects" && (
      <>
        <h1 className="text-3xl font-bold text-center mb-8">All Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={() => {
                setSelectedProject(project);
                setIsEditFormOpen(true);
              }}
              onDelete={() => {
                setSelectedProject(project);
                setActionType("delete");
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      </>
    )}
  </div>

  {/* Modals */}
  {isModalOpen && (
    <ConfirmActionModal
      actionType={actionType}
      onConfirm={handleAction}
      onCancel={() => setIsModalOpen(false)}
      adminName={selectedProject?.projectName}
    />
  )}

  {isCreateFormOpen && (
    <CreateProjectForm
      onClose={() => setIsCreateFormOpen(false)}
      onProjectCreated={(newProject) =>
        setProjects((prev) => [...prev, newProject])
      }
    />
  )}

  {isEditFormOpen && selectedProject && (
    <EditProjectForm
      project={selectedProject}
      onClose={() => setIsEditFormOpen(false)}
    />
  )}

  {isEditModalOpen && (
    <EditProfileModal
      profile={profileData}
      onClose={() => setIsEditModalOpen(false)}
      onProfileUpdated={handleProfileUpdated}
    />
  )}
</div>
    </div>
  );
};

export default AdminDashboard;
