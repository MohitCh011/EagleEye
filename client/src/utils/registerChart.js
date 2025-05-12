import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
  } from "chart.js";
  
  export const registerChartComponents = () => {
    ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
  };
  