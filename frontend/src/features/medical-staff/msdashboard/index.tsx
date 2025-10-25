import React, { useMemo } from "react";
import {
  DashboardLayout,
  ProfileSection,
  StatsGrid,
  ChartsSection,
} from "@shared/components/Dashboard";

import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import {
  useGetDashboardStatsQuery,
  useGetUserDetailsQuery,
} from "../../admin/dashboard/services/adminApi";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { imageMap } from "@shared/config/imageMap";
import { StatItem } from "../../admin/dashboard/type";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";

const AdminDashboard: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  // Queries (token added automatically via customBaseQuery)
  const { data: dashboardStats, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: adminDetails, isLoading: userLoading } =
    useGetUserDetailsQuery();

  const user = useMemo(
    () => ({
      name: adminDetails?.data?.name ?? "Admin User",
      qualification: adminDetails?.data?.qualification ?? "MBA, MD",
      profileImage: adminDetails?.data?.profileImage ?? null,
    }),
    [adminDetails]
  );

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
    <DashboardLayout>
      <ProfileSection {...user} />
      <StatsGrid stats={stats} />
      <ChartsSection
        barData={chartData.barData}
        doughnutData={chartData.doughnutData}
        selectedMonth="OCT 2025"
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
