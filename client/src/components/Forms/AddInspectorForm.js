import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../utils/api";
import { toast } from "react-toastify";

const AddInspectorForm = ({ project, onClose, onInspectorAdded }) => {
  console.log(project);
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
  
      // Ensure project._id exists
      if (!project || !project.id) {
        toast.error("Project information is invalid.");
        return;
      }
  
      const payload = {
        projectId: project.id, // Ensure project._id is passed correctly
        inspectorEmail: data.inspectorEmail,
        inspectorfirstName: data.inspectorFirstName,
      };
  
      // Make API call to add inspector
      const response = await API.post("/contractor/add-inspector", payload);
      toast.success(response.data.message || "Inspector added successfully!");
  
      // Call the parent function to update the project
      onInspectorAdded(response.data.data);
  
      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding inspector:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.message || "Failed to add inspector. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add Inspector</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Inspector Email
            </label>
            <input
              {...register("inspectorEmail", { required: true })}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter inspector's email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Inspector First Name
            </label>
            <input
              {...register("inspectorFirstName", { required: true })}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter inspector's first name"
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
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              } transition duration-300`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Inspector"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInspectorForm;
