import React from "react";

const PhaseCard = ({ phase, onAddPhase }) => {
  console.log(phase); // For debugging

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
      {/* Image of the phase */}
      <img
        src={phase.imageUrl || "https://via.placeholder.com/150"}
        alt="Phase Image"
        className="rounded-lg w-full h-48 object-cover mb-4"
      />

      {/* Phase Title */}
      <h2 className="text-xl font-bold mb-2">{phase.title}</h2>

      {/* Progress and Budget */}
      <div className="mb-2">
        <p className="text-gray-700">Progress: {phase.progress}%</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full"
            style={{ width: `${phase.progress}%` }}
          ></div>
        </div>

        {/* <p className="text-gray-700">Budget Used: ₹{phase.budgetUsed}</p> */}
      </div>

      {/* Activity Type */}
      {/* <p className="text-gray-700 mb-2">Activity Type: {phase.activityType}</p> */}

      {/* Analysis Results */}
      <div className="bg-gray-100 p-2 rounded-lg">
        <p className="text-gray-700 mb-4">Stage: {phase.analysisResults?.stage}</p>
        <p className="text-gray-700 mb-4">{phase?.footpath}</p>
        <p className="text-gray-700 mb-4"> {phase?.drinages}</p>
        {/* <p className="text-gray-700 mb-4"> {phase?.}</p> */}
        
        {/* <p className="text-gray-700 mb-4">Analysis: {phase.analysisResults?.description.detected_classes}</p> */}
        <p className="text-gray-700">Progress: {phase.analysisResults?.progress}%</p>
      </div>

    </div>
  );
};

export default PhaseCard;
