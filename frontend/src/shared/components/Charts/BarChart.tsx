import React from "react";
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

//  Register chart types once
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: any;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <div className="h-96 w-full">
      <Bar
        data={data}
        options={{
          indexAxis: "y",
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
