import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../utils/api";
import { MdEdit } from "react-icons/md";
import { FaUserAlt, FaHome, FaPlusCircle } from "react-icons/fa";
import ConfirmActionModal from "../Modals/ConfirmActionModal";
import AddAdminForm from "../Forms/AddAdminForm";
import EditProfileModal from "../Modals/EditProfileModal";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
const ITAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home"); // Tracks which tab is active
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // "delete" or "reset"
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Holds the search query

  // Fetch admins and logged-in admin details
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await API.get("/it-admin/admins");
        setAdmins(response.data.data.admins); // Fetch the admins
        setFilteredAdmins(response.data.data.admins); // Initialize filtered admins
      } catch (error) {
        toast.error("Failed to fetch admins!");
      }
    };

    const fetchProfile = async () => {
      try {
        const response = await API.get("/profile/getdetails");
        
        setProfileData(response.data.data); // Set the profile data
        localStorage.setItem("userImage",response.data.data.profileImage);
      } catch (error) {
        toast.error("Failed to fetch profile data!");
      }
    };

    fetchAdmins();
    fetchProfile();
  }, []);

  // Handle delete or reset password
  const handleAction = async () => {
    try {
      if (actionType === "delete") {
        await API.delete(`/it-admin/admins/${selectedAdmin._id}`);
        toast.success("Admin deleted successfully!");
        setAdmins((prev) => prev.filter((admin) => admin._id !== selectedAdmin._id));
        setFilteredAdmins((prev) => prev.filter((admin) => admin._id !== selectedAdmin._id)); // Filter out the deleted admin
      } else if (actionType === "reset") {
        await API.post("/it-admin/admins/reset-password", {
          adminId: selectedAdmin._id,
        });
        toast.success("Admin password reset to default successfully!");
      }
    } catch (error) {
      toast.error("Action failed! Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleAdminAdded = (newAdmin) => {
    setAdmins((prev) => [...prev, newAdmin]);
    setFilteredAdmins((prev) => [...prev, newAdmin]);
    setIsAddAdminOpen(false);
  };

  // Filter admins based on email search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);

    const filtered = admins.filter((admin) =>
      admin.email.toLowerCase().includes(query)
    );
    setFilteredAdmins(filtered);
  };

  // If profileData is not available, return a loading state
  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
 
 <div className="topbar text-center md:hidden">
  <ul className="flex justify-center w-full">
    <li
      className={`p-4 cursor-pointer hover:bg-blue-600 ${
        activeTab === "home" ? "bg-blue-600" : ""
      }`}
      onClick={() => setActiveTab("home")}
    >
      <FaHome className="inline mr-2" />
      Home
    </li>
    <li
      className={`p-4 cursor-pointer hover:bg-blue-600 ${
        activeTab === "admins" ? "bg-blue-600" : ""
      }`}
      onClick={() => setActiveTab("admins")}
    >
      <FaUserAlt className="inline mr-2" />
      All Admins
    </li>
    <li
      className={`p-4 cursor-pointer hover:bg-blue-600 ${
        activeTab === "addAdmin" ? "bg-blue-600" : ""
      }`}
      onClick={() => setActiveTab("addAdmin")}
    >
      <FaPlusCircle className="inline mr-2" />
      Add Admin
    </li>
  </ul>
</div>

    
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-65 bg-orange-700 text-white flex flex-col  hidden md:block">
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">IT Admin Dashboard</h2>
        </div>
        <nav className="flex-1">
          <ul>
            <li
              className={`p-4 cursor-pointer hover:bg-orange-600 ${
                activeTab === "home" ? "bg-orange-600" : ""
              }`}
              onClick={() => setActiveTab("home")}
            >
              <FaHome className="inline mr-2" />
              Home
            </li>
            <li
              className={`p-4 cursor-pointer hover:bg-orange-600 ${
                activeTab === "admins" ? "bg-orange-600" : ""
              }`}
              onClick={() => setActiveTab("admins")}
            >
              <FaUserAlt className="inline mr-2" />
              All Admins
            </li>
            <li
              className={`p-4 cursor-pointer hover:bg-orange-500 ${
                activeTab === "addAdmin" ? "bg-orange-500" : ""
              }`}
              onClick={() => setActiveTab("addAdmin")}
            >
              <FaPlusCircle className="inline mr-2" />
              Add Admin
            </li>
          </ul>
        </nav>
      </aside>
      

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeTab === "home" && (
      <div className="">
        <div className="text-5xl flex items-center justify-center font-serif">Welcome Back !!{ profileData?.firstName}</div>
      {/* Profile Photo Section */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        {/* Left Side Profile Section */}
        <div className="flex flex-col items-center bg-[#24a355] text-white p-6 rounded-lg w-full md:w-1/4 mb-6 md:mb-0">
          <img
            src={profileData?.profileImage || "https://www.gravatar.com/avatar/?d=mp"}
            alt="Profile"
            className="w-32 h-32 rounded-lg object-cover mb-4"
          />
          <h2 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
          <p className="text-sm">{profileData?.rollNo}</p>
          <div className="mt-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full bg-orange-200 text-red-900 py-2 px-4 rounded-md hover:bg-orange-400 transition duration-200 ease-in-out"
            >
              <span className="font-semibold text-lg">Edit Profile</span>
            </button>
          </div>
        </div>
    
        {/* Right Side Academic and Personal Details */}
        <div className="lg:ml-6 w-full md:w-3/4 md:items-center">
          <div className="pb-4 mb-6 border-2 border-gray-300 rounded-lg p-6 ">
            <h3 className="text-2xl font-semibold mb-5 flex items-center justify-center">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-auto py-auto">
              <div className="flex justify-start gap-5 text-sm border-b border-gray-200 pb-2 mb-2">
                <span className="font-bold">Email : </span>
                <span>{profileData?.email}</span>
              </div>
              <div className="flex justify-start gap-5 text-sm border-b border-gray-200 pb-2 mb-2">
                <span className="font-bold">Created Project Authorities Count : </span>
                <span>{profileData?.createdUsersCount}</span>
              </div>
              <div className="flex justify-start gap-5 text-sm border-b border-gray-200 pb-2 mb-2">
                <span className="font-bold">Role :</span>
                <span>{profileData?.role}</span>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
    
     
      
        )}

        {activeTab === "admins" && (
          <div>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by email"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-3 rounded-md border border-gray-300"
              />
            </div>

            {/* Admin Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredAdmins.map((admin) => (
    <div
      key={admin._id}
      className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-xl transform transition duration-300 hover:scale-105 border border-gray-300"
    >
      <div className="flex items-center justify-center mb-4">
        <img
          src={admin.profileImage || "https://www.gravatar.com/avatar/?d=mp"}
          alt="Profile"
          className="rounded-full w-20 h-20 shadow-xl"
        />
      </div>
      <div className="space-y-3 text-left">
        <p className="text-xl font-serif font-bold text-gray-800">{admin.firstName} {admin.lastName}</p>
        <p className="text-gray-700 text-sm">Email: {admin.email}</p>
        <p className="text-gray-700 text-sm">Contact: {admin.contactNumber || "N/A"}</p>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
        <button
          className="bg-transparent text-red-600 border-2 border-red-600 px-6 py-2 rounded-full hover:bg-red-100 hover:text-red-700 transition duration-300 font-serif text-sm"
          onClick={() => {
            setSelectedAdmin(admin);
            setActionType("delete");
            setIsModalOpen(true);
          }}
        >
          Delete
        </button>
        <button
          className="bg-transparent text-indigo-600 border-2 border-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition duration-300 font-serif text-sm"
          onClick={() => {
            setSelectedAdmin(admin);
            setActionType("reset");
            setIsModalOpen(true);
          }}
        >
          Reset Password
        </button>
      </div>
    </div>
  ))}
</div>
          </div>
        )}

        {activeTab === "addAdmin" && (
          <AddAdminForm
            onClose={() => setIsAddAdminOpen(false)}
            onAdminAdded={handleAdminAdded}
          />
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <ConfirmActionModal
          actionType={actionType}
          onConfirm={handleAction}
          onCancel={() => setIsModalOpen(false)}
          adminName={`${selectedAdmin.firstName} ${selectedAdmin.lastName}`}
        />
      )}

      {isEditModalOpen && (
        <EditProfileModal
          profile={profileData}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
    </div>
  );
};

export default ITAdminDashboard;