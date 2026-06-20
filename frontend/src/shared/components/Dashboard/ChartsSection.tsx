import React, { Suspense } from "react";
import { FaChartPie } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";
import { WidgetErrorBoundary } from "@shared/error";

const BarChart = React.lazy(() => import("../Charts/BarChart"));
const DoughnutChart = React.lazy(() => import("../Charts/DoughnutChart"));

interface ChartsSectionProps {
  barData: Record<string, unknown>;
  doughnutData: Record<string, unknown>;
  selectedMonth?: string;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  barData,
  doughnutData,
}) => {
  return (
    <section className="grid grid-cols-1 pb-12 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 dark:bg-card">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-4 flex items-center gap-2">
          <BsGraphUp className="text-purple-600" /> Department Utilization
        </h4>
        <div className="h-96">
          <WidgetErrorBoundary name="department-bar-chart">
            <Suspense
              fallback={
                <div className="text-center text-gray-500 dark:text-muted-foreground">
                  Loading chart...
                </div>
              }
            >
              <BarChart data={barData} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 dark:bg-card">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-4 flex items-center gap-2">
          <FaChartPie className="text-pink-500" /> Department Distribution
        </h4>
        <div className="h-96">
          <WidgetErrorBoundary name="department-doughnut-chart">
            <Suspense
              fallback={
                <div className="text-center text-gray-500 dark:text-muted-foreground">
                  Loading chart...
                </div>
              }
            >
              <DoughnutChart data={doughnutData} />
            </Suspense>
          </WidgetErrorBoundary>
        </div>
      </div>
    </section>
  );
};
