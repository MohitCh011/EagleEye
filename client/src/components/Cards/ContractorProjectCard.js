import React from "react";

const ContractorProjectCard = ({ project, onAddInspector }) => {
  return (
    <div className="bg-gradient-to-r from-white to-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4">{project.projectName}</h2>

      <div className="mb-4">
        <p className="text-gray-600 mb-1">Progress</p>
        <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-500 mt-1">{project.progress}%</p>
      </div>

      {/* <p className="text-gray-700 mb-2">
        <span className="font-semibold">Budget:</span> ₹{project.budget.allotted}
      </p> */}
      <p className="text-gray-700 mb-4">
        <span className="font-semibold">Status:</span> {project.status}
      </p>

      <button
        className="mt-4 bg-blue-600 text-white font-medium px-5 py-2 rounded-full shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
        onClick={onAddInspector}
      >
        Add Inspector
      </button>
    </div>
  );
};

export default ContractorProjectCard;
