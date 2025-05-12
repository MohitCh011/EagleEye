import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../utils/api";
import OngoingProjectCard from "../components/Cards/OngoinProjectCard";
import Navbar from "../components/Navbar/Navbar";

const CompletedProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch completed projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await API.get("/projects/completed");
        setProjects(response.data.data);
      } catch (error) {
        setError("Failed to fetch completed projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-bold">Loading completed projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Completed Projects</h1>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {projects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <OngoingProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
    </>
  );
};

export default CompletedProjectsPage;
