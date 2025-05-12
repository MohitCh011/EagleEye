import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../utils/api";
import { toast } from "react-toastify";

const CreateProjectForm = ({ onClose, onProjectCreated }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCoordinates = async (locationName) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data && data.length > 0) {
        const { lat, lon } = data[0];  // Nominatim returns longitude as `lon`, not `lng`
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        throw new Error(`Unable to find location coordinates for ${locationName}`);
      }
    } catch (error) {
      throw new Error(`Error getting coordinates: ${error.message}`);
    }
  };
  
  

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Convert start and end locations to coordinates
      // const startCoordinates = await getCoordinates(data.startLocation);
      // const endCoordinates = await getCoordinates(data.endLocation);

      // if (!startCoordinates || !endCoordinates) {
      //   toast.error("Failed to convert locations to coordinates. Please check the inputs.");
      //   return;
      // }

      // Prepare payload for backend
      const payload = {
        projectName: data.projectName,
        budget: parseFloat(data.budget),
        // startCoordinates,
        // endCoordinates,
        contractorEmail: data.contractorEmail,
        contractorFirstName: data.contractorFirstName,
      };

      // Send data to backend
      const response = await API.post("/admin/create-project", payload);
      toast.success("Project created successfully!");

      onProjectCreated(response.data.data); // Update parent component
      reset();
      onClose(); // Close the form modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center mt-[50px] justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Project Name</label>
            <input
              {...register("projectName", { required: true })}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter project name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Contractor Email</label>
            <input
              {...register("contractorEmail", { required: true })}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter contractor email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Contractor First Name</label>
            <input
              {...register("contractorFirstName", { required: true })}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter contractor first name"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
              } transition duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
