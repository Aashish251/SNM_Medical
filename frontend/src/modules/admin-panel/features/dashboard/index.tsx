import { Header } from "@admin-panel/components/layout/header";
import { Main } from "@admin-panel/components/layout/main";
import { ProfileDropdown } from "@admin-panel/components/profile-dropdown";
import { Search } from "@admin-panel/components/search";
import { ThemeSwitch } from "@admin-panel/components/theme-switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@admin-panel/components/ui/tabs";
import { DashboardAnalyticsTab } from "./components/dashboard-analytics-tab";
import { DashboardOverviewTab } from "./components/dashboard-overview-tab";
import { DashboardReportsTab } from "./components/dashboard-reports-tab";

export function Dashboard() {
  return (
    <>
      <Header fixed>
        <Search className="me-auto" />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of the Medical Seva Admin Portal
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <DashboardOverviewTab />
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <DashboardAnalyticsTab />
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <DashboardReportsTab />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}
