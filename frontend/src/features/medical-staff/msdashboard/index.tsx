import React, { useMemo } from "react";
import {
  DashboardLayout,
  ProfileSection,
  StatsGrid,
  ChartsSection,
} from "@widgets/dashboard-shell";

import {
  useGetDashboardStatsQuery,
  useGetUserDetailsQuery,
} from "../../admin/dashboard/services/adminApi";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { WidgetErrorBoundary } from "@shared/error";
import { imageMap } from "@shared/config/imageMap";
import { StatItem } from "../../admin/dashboard/type";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";

const AdminDashboard: React.FC = () => {
  const { data: dashboardStats, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { isLoading: userLoading } = useGetUserDetailsQuery();

  const stats: StatItem[] = useMemo(() => {
    const apiStats = dashboardStats?.data?.stats ?? [];

    return apiStats.map((item: StatItem) => ({
      ...item,
      image: imageMap[item.title] || DEFAULT_PROFILE_IMAGE,
    }));
  }, [dashboardStats]);

  const chartData = useMemo(() => {
    if (!stats.length) {
      return {
        barData: { labels: [], datasets: [] },
        doughnutData: { labels: [], datasets: [] },
      };
    }

    const labels = stats.map((s) => s.title);
    const values = stats.map((s) => s.value);
    const colors = stats.map((s) => s.color);

    const dataset = [{ data: values, backgroundColor: colors }];

    return {
      barData: { labels, datasets: dataset },
      doughnutData: { labels, datasets: dataset },
    };
  }, [stats]);

  if (statsLoading || userLoading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <>
      <div className="pt-18 md:pt-18 lg:pt-18">
        <WidgetErrorBoundary name="dashboard-profile">
          <ProfileSection />
        </WidgetErrorBoundary>
      </div>

      <DashboardLayout>
        <WidgetErrorBoundary name="dashboard-stats">
          <StatsGrid stats={stats} />
        </WidgetErrorBoundary>
        <ChartsSection
          barData={chartData.barData}
          doughnutData={chartData.doughnutData}
        />
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;
