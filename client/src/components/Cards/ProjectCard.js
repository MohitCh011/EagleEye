import React from "react";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
      {/* Center text */}
      <h2 className="text-xl font-serif font-bold text-gray-800 text-center">{project.projectName}</h2>
      <p className="text-gray-500 text-lg text-center">Progress: {project.progress}%</p>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full">
        <div
          className="h-full rounded-full"
          style={{ width: `${project.progress}%`, backgroundColor: '#4caf50' }}
        ></div>
      </div>

      {/* Buttons - Stack on medium and small screens */}
      <div className="mt-6 flex justify-center gap-4 md:flex-row flex-col">
        <button
          className="bg-transparent text-green-600 border-2 border-green-600 px-6 py-2 rounded-full hover:bg-green-100 hover:text-green-700 transition duration-300 font-serif text-sm"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="bg-transparent text-red-600 border-2 border-red-600 px-6 py-2 rounded-full hover:bg-red-100 hover:text-red-700 transition duration-300 font-serif text-sm"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
