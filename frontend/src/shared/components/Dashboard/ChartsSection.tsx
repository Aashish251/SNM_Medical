import React, { Suspense } from "react";
import { FaChartPie } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";

const BarChart = React.lazy(() => import("../Charts/BarChart"));
const DoughnutChart = React.lazy(() => import("../Charts/DoughnutChart"));

interface ChartsSectionProps {
  barData: any;
  doughnutData: any;
  selectedMonth?: string;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  barData,
  doughnutData,
  selectedMonth,
}) => {
  return (
    <section className="grid grid-cols-1 pb-12 md:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BsGraphUp className="text-purple-600" /> Department Utilization
        </h4>
        <div className="h-96">
          <Suspense
            fallback={
              <div className="text-center text-gray-500">Loading chart...</div>
            }
          >
            <BarChart data={barData} />
          </Suspense>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartPie className="text-pink-500" /> Department Distribution
        </h4>
        <div className="h-96">
          <Suspense
            fallback={
              <div className="text-center text-gray-500">Loading chart...</div>
            }
          >
            <DoughnutChart data={doughnutData} />
          </Suspense>
        </div>
      </div>
    </section>
  );
};
