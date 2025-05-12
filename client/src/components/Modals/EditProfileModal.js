import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../utils/api";

const EditProfileModal = ({ profile, onClose }) => {
    const [newProfileData, setNewProfileData] = useState({
        contactNumber: profile.contactNumber || "",
        profileImage: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveProfile = async () => {
      try {
        setIsSubmitting(true);
        const formData = new FormData();
    
        // Check if contactNumber is changed and append it
        if (newProfileData.contactNumber !== profile.contactNumber) {
          formData.append("contactNumber", newProfileData.contactNumber);
        }
    
        // Check if a file is selected and append it
        if (newProfileData.profileImage) {
          console.log("File selected:", newProfileData.profileImage);  // Ensure the file is correctly selected
          formData.append("profileImage", newProfileData.profileImage);
        } else {
          console.log("No file selected.");
        }
    
        // Log FormData entries for debugging
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
    
        const token = localStorage.getItem("authToken");
        const response = await API.patch("/profile/updateprofile", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        toast.success("Profile updated successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
    
        onClose(); // Close the modal after successful update
        setTimeout(() => {
          window.location.reload();
        }, 10); // Adding a slight delay for better UX
        } catch (error) {
        console.error("Error while updating profile:", error);
        toast.error("Failed to update profile.", {
          position: "top-center",
          autoClose: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                <form>
                    {/* Display First Name, Last Name, Email (Non-editable) */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">First Name</label>
                        <input
                            type="text"
                            value={profile.firstName}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Last Name</label>
                        <input
                            type="text"
                            value={profile.lastName}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
                        />
                    </div>

                    {/* Editable fields */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Contact Number</label>
                        <input
                            type="text"
                            value={newProfileData.contactNumber}
                            onChange={(e) =>
                                setNewProfileData({ ...newProfileData, contactNumber: e.target.value })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Enter new contact number"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Profile Image</label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setNewProfileData({ ...newProfileData, profileImage: e.target.files[0] })
                            }
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300 ${
                                isSubmitting ? "cursor-not-allowed opacity-50" : ""
                            }`}
                            onClick={handleSaveProfile}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
