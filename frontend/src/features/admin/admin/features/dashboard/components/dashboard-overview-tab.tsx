import React from "react";
import { DashboardStatCard } from "./dashboard-stat-card";
import { QuickActionCard } from "./quick-action-card";
import { RecentActivityCard } from "./recent-activity-card";
import { SectionHeader } from "./section-header";
import { StaffOverviewCard } from "./staff-overview-card";
import {
  departmentStaff as defaultDepartmentStaff,
  quickActions,
  recentActivities as defaultRecentActivities,
} from "../data/dashboard-data";
import type {
  AdminDashboardSummary,
  DashboardStatsData,
  PatientRegistrationItem,
  BloodDriveItem,
} from "../services/dashboardApi";
import type { RecentActivityItem } from "./recent-activity-card";
import {
  ClipboardList,
  UserCheck,
  Ticket,
  Stethoscope,
  Droplets,
  HeartPulse,
} from "lucide-react";
import { imageMap } from "@shared/config/imageMap";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";

interface DashboardOverviewTabProps {
  summary?: AdminDashboardSummary | null;
  dashboardStats?: DashboardStatsData | null;
  recentPatients?: PatientRegistrationItem[] | null;
  bloodDrives?: BloodDriveItem[] | null;
  isLoading?: boolean;
}

export function DashboardOverviewTab({
  summary,
  dashboardStats,
  recentPatients,
  bloodDrives,
  isLoading = false,
}: DashboardOverviewTabProps) {
  // 1. Resolve department stats list
  const apiDeptStats = dashboardStats?.departmentStats || dashboardStats?.stats;
  const departments = React.useMemo(() => {
    if (apiDeptStats && apiDeptStats.length > 0) {
      const totalStaff = apiDeptStats.reduce(
        (sum, d) => sum + (Number(d.value) || 0),
        0
      );
      return apiDeptStats.map((dept) => {
        const val = Number(dept.value) || 0;
        const pct = totalStaff > 0 ? Math.round((val / totalStaff) * 100) : 0;
        return {
          title: dept.title,
          value: val,
          color: dept.color || "#3B82F6",
          image: imageMap[dept.title] || DEFAULT_PROFILE_IMAGE,
          percentage: pct,
        };
      });
    }
    const defaultTotal = defaultDepartmentStaff.reduce(
      (sum, d) => sum + d.value,
      0
    );
    return defaultDepartmentStaff.map((dept) => ({
      ...dept,
      percentage: defaultTotal > 0 ? Math.round((dept.value / defaultTotal) * 100) : 0,
    }));
  }, [apiDeptStats]);

  // 2. Resolve summary KPI stats
  const totalUsers = summary?.totalUsers ?? dashboardStats?.totalUsers ?? 1248;
  const presentUsers = summary?.presentUsers ?? 38;
  const usersWithPass = summary?.usersWithPass ?? 42;
  const totalStaffCount =
    summary?.medicalStaff ??
    departments.reduce((sum, d) => sum + d.value, 0);
  const totalBloodDrives = bloodDrives?.length ?? 12;

  const presentPercentage =
    totalUsers > 0 ? Math.round((presentUsers / totalUsers) * 100) : 0;

  // 3. Resolve recent activities (prefer live patient registrations)
  const activities: RecentActivityItem[] = React.useMemo(() => {
    if (recentPatients && recentPatients.length > 0) {
      const patientItems: RecentActivityItem[] = recentPatients
        .slice(0, 5)
        .map((p) => {
          let formattedTime = "Recently";
          if (p.date) {
            formattedTime = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
            }).format(new Date(p.date));
          } else if (p.createdAt) {
            formattedTime = new Intl.DateTimeFormat("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(p.createdAt));
          }

          const details = [
            `Reg #${p.regnNo}`,
            p.disease || "OPD Consultation",
            p.age ? `${p.age} yrs` : null,
          ]
            .filter(Boolean)
            .join(" • ");

          return {
            id: `patient-${p.id}`,
            title: p.patientName,
            description: details,
            timestamp: formattedTime,
            type: "patient",
            badge: p.gender
              ? p.gender.charAt(0).toUpperCase() + p.gender.slice(1).toLowerCase()
              : "OPD",
          };
        });

      // If we have fewer than 4 patient items, pad with default administrative events
      if (patientItems.length < 4) {
        return [...patientItems, ...defaultRecentActivities.slice(0, 4 - patientItems.length)];
      }
      return patientItems;
    }
    return defaultRecentActivities;
  }, [recentPatients]);

  return (
    <div className="space-y-6">
      {/* Summary KPI Statistics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <SectionHeader
            title="Summary Statistics"
            description="Live overview of registrations, attendance, passes, and healthcare campaigns."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <DashboardStatCard
            label="Total Registrations"
            value={totalUsers}
            icon={ClipboardList}
            color="#2563EB"
            badge="Enrolled"
            change="+12% from last month"
            trend="up"
          />
          <DashboardStatCard
            label="Present on Duty"
            value={presentUsers}
            icon={UserCheck}
            color="#059669"
            badge={`${presentPercentage}% active`}
            change="Verified presence today"
            trend="up"
          />
          <DashboardStatCard
            label="Pass Entry Issued"
            value={usersWithPass}
            icon={Ticket}
            color="#7C3AED"
            badge="Gate Ready"
            change="Active passes authorized"
          />
          <DashboardStatCard
            label="Active Medical Staff"
            value={totalStaffCount}
            icon={Stethoscope}
            color="#0EA5E9"
            change={`Across ${departments.length} departments`}
          />
          <DashboardStatCard
            label="Blood Donation Camps"
            value={totalBloodDrives}
            icon={Droplets}
            color="#EF4444"
            badge="Camps"
            change="Scheduled & completed"
          />
          <DashboardStatCard
            label="Health Checkups"
            value={24}
            icon={HeartPulse}
            color="#10B981"
            badge="Outreach"
            change="Community camps held"
          />
        </div>
      </section>

      {/* Department Staff Information */}
      <section className="space-y-4">
        <SectionHeader
          title="Staff Information"
          description="Department-wise active staff count across Medical Seva units."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {departments.map((dept) => (
            <StaffOverviewCard
              key={dept.title}
              title={dept.title}
              value={dept.value}
              color={dept.color}
              image={dept.image}
              percentage={dept.percentage}
            />
          ))}
        </div>
      </section>

      {/* Recent Activities & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <SectionHeader
            title="Recent Activity"
            description="Live feed of recent patient consultations and key administrative events."
          />
          <div className="space-y-2.5">
            {activities.map((activity) => (
              <RecentActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader
            title="Quick Actions"
            description="Direct shortcuts to common medical operations and registry records."
          />
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
