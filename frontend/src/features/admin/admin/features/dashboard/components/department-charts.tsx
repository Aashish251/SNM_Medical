import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { departmentChartData } from "../data/dashboard-data";
import type { DepartmentStatItem } from "../services/dashboardApi";

interface DepartmentChartsProps {
  departmentStats?: DepartmentStatItem[];
}

export function DepartmentCharts({ departmentStats }: DepartmentChartsProps) {
  const chartItems = React.useMemo(() => {
    if (departmentStats && departmentStats.length > 0) {
      return departmentStats.map((item) => ({
        name: item.title,
        value: Number(item.value) || 0,
        fill: item.color || "#3B82F6",
      }));
    }
    return departmentChartData.labels.map((label, i) => ({
      name: label,
      value: departmentChartData.values[i] || 0,
      fill: departmentChartData.colors[i] || "#3B82F6",
    }));
  }, [departmentStats]);

  const barChartData = React.useMemo(() => {
    // Sort descending for cleaner vertical bar chart visualization
    return [...chartItems].sort((a, b) => b.value - a.value);
  }, [chartItems]);

  const pieChartData = React.useMemo(() => {
    return chartItems.filter((d) => d.value > 0);
  }, [chartItems]);

  const totalStaff = React.useMemo(() => {
    return chartItems.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartItems]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Bar Chart */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-card">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold sm:text-lg">
              Department Utilization
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Staff distribution ranked across active departments
            </CardDescription>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            {chartItems.length} Depts
          </span>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={380}>
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 12, fill: "currentColor" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const pct = totalStaff > 0 ? Math.round((data.value / totalStaff) * 100) : 0;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white/95 p-2.5 shadow-lg backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95">
                        <p className="text-xs font-semibold text-foreground">{data.name}</p>
                        <p className="text-sm font-bold text-primary">
                          {data.value} Sewadars <span className="text-xs font-normal text-muted-foreground">({pct}%)</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {barChartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-card">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-base font-bold sm:text-lg">
              Department Distribution
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Percentage share of active staff by department
            </CardDescription>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
            {totalStaff} Total Staff
          </span>
        </CardHeader>
        <CardContent className="pt-2">
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={125}
                paddingAngle={2}
              >
                {pieChartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const pct = totalStaff > 0 ? Math.round((data.value / totalStaff) * 100) : 0;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white/95 p-2.5 shadow-lg backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: data.fill }}
                          />
                          <p className="text-xs font-semibold text-foreground">{data.name}</p>
                        </div>
                        <p className="mt-1 text-sm font-bold text-foreground">
                          {data.value} Sewadars{" "}
                          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            ({pct}%)
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {value}
                  </span>
                )}
                wrapperStyle={{ maxHeight: 70, overflowY: "auto" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
