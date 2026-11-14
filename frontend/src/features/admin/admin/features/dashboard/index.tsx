import React from "react";
import { Header } from "@admin/components/layout/header";
import { Main } from "@admin/components/layout/main";
import { ProfileDropdown } from "@admin/components/profile-dropdown";
import { Search } from "@admin/components/search";
import { ThemeSwitch } from "@admin/components/theme-switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@admin/components/ui/tabs";
import { useAppSelector } from "@app/store/hooks";
import {
  useGetAdminSummaryQuery,
  useGetDashboardStatsQuery,
  useGetRecentPatientsQuery,
  useGetBloodDrivesListQuery,
  type BloodDriveItem,
} from "./services/dashboardApi";
import { DashboardOverviewTab } from "./components/dashboard-overview-tab";
import { DashboardAnalyticsTab } from "./components/dashboard-analytics-tab";
import { DashboardReportsTab } from "./components/dashboard-reports-tab";

export function Dashboard() {
  const { userType } = useAppSelector((state) => state.auth);
  const isAdmin = userType === "admin";

  const {
    data: summaryRes,
    isLoading: isSummaryLoading,
  } = useGetAdminSummaryQuery(undefined, { skip: !isAdmin });

  const {
    data: statsRes,
    isLoading: isStatsLoading,
  } = useGetDashboardStatsQuery();

  const {
    data: patientsRes,
    isLoading: isPatientsLoading,
  } = useGetRecentPatientsQuery();

  const {
    data: bloodDrivesRes,
    isLoading: isDrivesLoading,
  } = useGetBloodDrivesListQuery();

  const summaryData = summaryRes?.data ?? null;
  const statsData = statsRes?.data ?? null;
  const recentPatientsData = patientsRes?.data?.items ?? null;
  
  const rawBloodDrives = bloodDrivesRes?.data;
  const bloodDrivesData: BloodDriveItem[] | null = Array.isArray(rawBloodDrives)
    ? rawBloodDrives
    : (rawBloodDrives as { items?: BloodDriveItem[] } | undefined)?.items ?? null;

  const isLoading = (isAdmin && isSummaryLoading) || isStatsLoading;

  return (
    <>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Dashboard Navigation Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex w-full items-center justify-between overflow-x-auto pb-1">
            <TabsList className="bg-slate-100/80 p-1 dark:bg-slate-900/80">
              <TabsTrigger
                value="overview"
                className="rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-card"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-card"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="rounded-lg px-4 py-2 text-xs font-semibold sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-xs dark:data-[state=active]:bg-card"
              >
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 focus-visible:outline-hidden">
            <DashboardOverviewTab
              summary={summaryData}
              dashboardStats={statsData}
              recentPatients={recentPatientsData}
              bloodDrives={bloodDrivesData}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 focus-visible:outline-hidden">
            <DashboardAnalyticsTab
              summary={summaryData}
              dashboardStats={statsData}
              recentPatients={recentPatientsData}
              bloodDrives={bloodDrivesData}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 focus-visible:outline-hidden">
            <DashboardReportsTab />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}
