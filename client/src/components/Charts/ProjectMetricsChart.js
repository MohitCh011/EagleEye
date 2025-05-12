import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProjectMetricsChart = ({ metrics }) => {
  const data = {
    labels: ["Total Projects", "Completed", "Ongoing"],
    datasets: [
      {
        label: "Projects",
        data: [
          metrics.totalProjects || 0,
          metrics.completedProjects || 0,
          metrics.ongoingProjects || 0,
        ],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Project Metrics Overview",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg w-full max-w-7xl mx-auto">
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProjectMetricsChart;
