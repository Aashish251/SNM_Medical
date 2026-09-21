import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { SectionHeader } from "./section-header";
import { CampActivityChart } from "./camp-activity-chart";
import { DepartmentCharts } from "./department-charts";
import { RegistrationTrendChart } from "./registration-trend-chart";

function AnalyticsStatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}

export function DashboardAnalyticsTab() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Department Analytics"
        description="Visual reports and department distribution charts."
      />
      <DepartmentCharts />

      <SectionHeader
        title="Registration Trends"
        description="Monthly patient registration volume."
      />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Monthly Registrations</CardTitle>
          <CardDescription>
            Patient registrations over the past year
          </CardDescription>
        </CardHeader>
        <CardContent className="ps-2">
          <RegistrationTrendChart />
        </CardContent>
      </Card>

      <SectionHeader
        title="Camp Activity"
        description="Health camps and patient outreach trends."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsStatCard
          label="Total Camps"
          value="36"
          change="+4 this month"
        />
        <AnalyticsStatCard
          label="Patients Served"
          value="2,850"
          change="+18% vs last month"
        />
        <AnalyticsStatCard
          label="Blood Units"
          value="540"
          change="12 camps completed"
        />
        <AnalyticsStatCard
          label="Avg. Daily OPD"
          value="320"
          change="Stable week-over-week"
        />
      </div>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Weekly Camp Activity</CardTitle>
          <CardDescription>Camps conducted vs patients served</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <CampActivityChart />
        </CardContent>
      </Card>
    </div>
  );
}
