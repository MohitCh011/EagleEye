import React from "react";
import { Bar } from "react-chartjs-2";

const InspectorMetricsChart = ({ metrics }) => {
  const data = {
    labels: ["Total Phases", "Completed Phases", "Progress (%)"],
    datasets: [
      {
        label: "Metrics",
        data: [
          metrics.totalPhases,
          metrics.completedPhases,
          metrics.averageProgress,
        ],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar data={data} />
    </div>
  );
};

export default InspectorMetricsChart;
