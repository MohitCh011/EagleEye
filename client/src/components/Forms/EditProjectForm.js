import React, { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../utils/api";
import { toast } from "react-toastify";

const EditProjectForm = ({ project, onClose, onProjectUpdated }) => {
  const { register, handleSubmit } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare payload for backend
      const payload = {
        projectId: project._id,
        newContractorEmail: data.newContractorEmail,
        contractorFirstName: data.contractorFirstName,
      };

      // Send data to backend
      const response = await API.patch("/admin/edit-project", payload);
      toast.success("Project updated successfully!");

      onProjectUpdated(response.data.data); // Update parent component
      onClose(); // Close the form modal
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Project Name</label>
            <input
              type="text"
              value={project.projectName}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              New Contractor Email
            </label>
            <input
              {...register("newContractorEmail", { required: true })}
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter new contractor's email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              New Contractor First Name
            </label>
            <input
              {...register("contractorFirstName", { required: true })}
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter new contractor's first name"
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
              {isSubmitting ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectForm;
