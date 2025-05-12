import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/api';
import PhaseCard from "../components/Cards/PhaseCard";
import CreatePhaseForm from "../components/Forms/CreatePhaseForm";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ProjectPhasesPage = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const [isCreatePhaseFormOpen, setIsCreatePhaseFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("All"); // State to track selected activity type
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [selectedPhase, setSelectedPhase] = useState(null); // State for popup modal
  const navigate = useNavigate();

  // Fetch project details by projectId
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await API.get(`/projects/${projectId}`); // Fetch project details by projectId
        setProject(response.data.data); // Set project data
      } catch (error) {
        toast.error("Failed to fetch project details!");
        navigate("/inspector-dashboard"); // Navigate back to dashboard if error
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

  const handlePhaseCreated = (newPhase) => {
    setProject((prevProject) => ({
      ...prevProject,
      phases: [...prevProject.phases, newPhase], // Add the new phase to the phases array
    }));
  };

  // Extract unique activity types from the phases
  const activityTypes = ["All", ...(project?.phases ? [...new Set(project.phases.map((phase) => phase.activityType))] : [])];

  // Filtered phases based on selected activity
  const filteredPhases = selectedActivity === "All"
    ? project?.phases
    : project?.phases.filter((phase) => phase.activityType === selectedActivity);

  // Calculate average progress for the selected activity or all activities
  const calculateAverageProgress = () => {
    if (!project?.phases || project.phases.length === 0) {
      return 0; // No phases available
    }
    const phasesToCalculate = selectedActivity === "All" ? project.phases : filteredPhases;
    const totalProgress = phasesToCalculate.reduce((sum, phase) => sum + (phase.progress || 0), 0);
    return Math.round(totalProgress / phasesToCalculate.length); // Average progress
  };

  const averageProgress = calculateAverageProgress();

  return (
    <motion.div
      className="min-h-screen bg-gray-100 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 relative">
        <div className="flex items-center mb-8">
          {/* Back Button with Left Arrow */}
          <motion.button
            className="text-blue-500 mr-4 flex items-center"
            onClick={() => navigate("/inspector-dashboard")} // Navigate back to the dashboard
            whileHover={{ x: -10 }} // Slide left on hover
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </motion.button>

          {/* Activity Type Dropdown */}
          <motion.div
            className="relative ml-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              className="text-gray-700 px-3 py-1 rounded flex items-center"
              onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown
            >
              {selectedActivity}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 inline-block ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <motion.ul
                className="absolute right-0 top-full mt-1 shadow rounded text-sm text-gray-700"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {activityTypes.map((activityType) => (
                  <li
                    key={activityType}
                    onClick={() => {
                      setSelectedActivity(activityType);
                      setIsDropdownOpen(false); // Close dropdown
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedActivity === activityType ? "font-bold" : ""
                    }`}
                  >
                    {activityType}
                  </li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-8">
          {selectedActivity} Progress: {averageProgress}%
        </h1>

        {/* Display Phases */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredPhases?.map((phase) => (
            <div
              key={phase._id}
              onClick={() => setSelectedPhase(phase)}
              className="cursor-pointer"
            >
              <PhaseCard phase={phase} />
            </div>
          ))}
        </motion.div>

        {/* Add Phase Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => setIsCreatePhaseFormOpen(true)}
            className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-700"
          >
            Add Phase
          </button>
        </div>
      </div>

      {/* Create Phase Form */}
      {isCreatePhaseFormOpen && project && (
        <CreatePhaseForm
          project={projectId} // Pass the selected project to CreatePhaseForm
          onClose={() => setIsCreatePhaseFormOpen(false)}
          onPhaseCreated={handlePhaseCreated}
        />
      )}

      {/* Phase Details Popup */}
      {selectedPhase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            {/* <h2 className="text-xl font-bold mb-4">{selectedPhase.title}</h2>
            <p className="mb-4">Activity Type: {selectedPhase.activityType}</p>
            <p className="mb-4">Progress: {selectedPhase.progress}%</p> */}
            {/* <p className="mb-4">Budget Used: ${selectedPhase.budgetUsed}</p> */}
            {selectedPhase.analysisResults && (
              <p className="mb-4">Analysis: {JSON.stringify(selectedPhase.analysisResults)}</p>
            )}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setSelectedPhase(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectPhasesPage;