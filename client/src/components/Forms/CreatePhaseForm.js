import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../utils/api";
import { toast } from "react-toastify";

const CreatePhaseForm = ({ project, onClose, onPhaseCreated }) => {
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phaseData, setPhaseData] = useState(null); // Store the phase data from the backend
  const [Data, PhaseData] = useState(null); // Store the phase data from the backend
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("projectId", project); // Attach project ID from the passed prop
      // formData.append("title", data.title);
      // formData.append("activityType", data.activityType);
      //formData.append("budgetUsed", data.budgetUsed);
      formData.append("image", data.image[0]); // Attach the image file

      const token = localStorage.getItem("authToken");
      console.log(formData);
      PhaseData(formData);
      const response = await API.post("/phases/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the Authorization header
        },
      });

      if (response.data.success) {
        // Set phase data received from the backend for review
        setPhaseData(response.data.data);
        console.log(response.data.data);
        toast.success("Phase created successfully! Review the phase details.");
      } else {
        toast.error("Failed to create phase. Please try again.");
      }
    } catch (error) {
      console.error("Error response:", error.response || error); // Log full error object
      if (error.response) {
        toast.error(
          error.response?.data?.message || "Failed to create phase. Please try again."
        );
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save the phase to the backend and the project
  const handleSavePhase = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Send projectId and other necessary data to the save endpoint
      const response = await API.post(
        "/phases/save",
        { projectId: project }, // Send the projectId in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Phase saved successfully!");
        onPhaseCreated(response.data.data); // Update parent component
        onClose(); // Close the form/modal
      } else {
        toast.error("Failed to save phase. Please try again.");
      }
    } catch (error) {
      toast.error("Error while saving phase. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {phaseData ? (
          // Display Phase Details After Creation
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2 text-center">Progress Details</h3>
            
            <p><strong>Analysis Results:</strong> Progress: {phaseData.analysisResults.progress}%,  {phaseData.analysisResults.description}</p>
            <img src={phaseData.imageUrl} alt="Phase Image" className="my-2 w-full h-auto" />
            <div className="flex justify-between">
            <button
              onClick={handleSavePhase}
              className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-700 mt-2"
            >
              Save Phase
            </button>
            <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                  onClick={onClose}
                >
                  Cancel
            </button>
            </div>
          </div>
        ) : (
          // Show Form for Creating Phase
          <>
            <h2 className="text-xl font-bold mb-4">Update New Progress</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Image</label>
                <input
                  {...register("image", { required: true })}
                  type="file"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
                  {isSubmitting ? "Analysing Data..." : "Create Phase"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatePhaseForm;
