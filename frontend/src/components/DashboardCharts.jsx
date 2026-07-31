import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function DashboardCharts({ dashboard }) {
  // Chart Data
  const data = {
    labels: ["Documents", "Users", "Today's Uploads"],

    datasets: [
      {
        label: "Dashboard Analytics",

        data: [
          dashboard.total_documents,
          dashboard.total_users,
          dashboard.todays_uploads,
        ],

        backgroundColor: [
          "#3B82F6", // Blue
          "#10B981", // Green
          "#F59E0B", // Orange
        ],

        borderColor: [
          "#2563EB",
          "#059669",
          "#D97706",
        ],

        borderWidth: 2,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "AI Legal Document Analyzer Dashboard",
      },
    },
  };

  return (
    <div className="card">
      <h2>📊 Dashboard Analytics</h2>

      <Bar data={data} options={options} />
    </div>
  );
}

export default DashboardCharts;