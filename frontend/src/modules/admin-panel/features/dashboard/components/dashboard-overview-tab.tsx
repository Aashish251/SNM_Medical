import { DashboardStatCard } from "./dashboard-stat-card";
import { QuickActionCard } from "./quick-action-card";
import { RecentActivityCard } from "./recent-activity-card";
import { SectionHeader } from "./section-header";
import { StaffOverviewCard } from "./staff-overview-card";
import {
  departmentStaff,
  quickActions,
  recentActivities,
  summaryStats,
} from "../data/dashboard-data";

export function DashboardOverviewTab() {
  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <SectionHeader title="Summary Statistics" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryStats.map((stat) => (
            <DashboardStatCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Staff Information"
          description="Department-wise active staff count across Medical Seva units."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {departmentStaff.map((dept) => (
            <StaffOverviewCard key={dept.title} {...dept} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <SectionHeader title="Recent Activities" />
          <div className="space-y-2">
            {recentActivities.map((activity) => (
              <RecentActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Quick Actions" />
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <QuickActionCard key={action.id} {...action} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
