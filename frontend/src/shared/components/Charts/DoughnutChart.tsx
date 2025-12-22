import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

//  Register chart elements only once
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: any;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  return (
    <div className="h-96 w-full">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: {
            legend: { position: "right" as const },
          },
        }}
      />
    </div>
  );
};

export default DoughnutChart;
