import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ContractorMetricsChart = ({ metrics }) => {
  const chartRef = useRef(null);

  const data = {
    labels: ["Total Projects", "Completed", "Ongoing"],
    datasets: [
      {
        label: "Projects",
        data: [
          metrics.totalManagedProjects,
          metrics.completedManagedProjects,
          metrics.ongoingManagedProjects,
        ],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
      },
    ],
  };

  useEffect(() => {
    const chartInstance = chartRef.current;

    // Cleanup: Destroy the chart instance to avoid re-use issues
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Doughnut ref={chartRef} data={data} />
    </div>
  );
};

export default ContractorMetricsChart;
