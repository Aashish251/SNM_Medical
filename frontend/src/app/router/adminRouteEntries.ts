import type { ComponentType } from "react";

export type AdminRouteEntry = {
  path: string;
  name: string;
  loader: () => Promise<{ default: ComponentType }>;
};

/**
 * Nested child routes under /admin served with sidebar layout (Administrator Portal).
 */
export const adminRouteEntries: AdminRouteEntry[] = [
  {
    path: "dashboard",
    name: "admin-dashboard",
    loader: () =>
      import("@admin/features/dashboard").then((m) => ({
        default: m.Dashboard,
      })),
  },
  {
    path: "users",
    name: "admin-users",
    loader: () =>
      import("@admin/features/users").then((m) => ({ default: m.Users })),
  },
  {
    path: "registration-report",
    name: "admin-registration-report",
    loader: () =>
      import("@admin/features/registration-report").then((m) => ({
        default: m.RegistrationReport,
      })),
  },
  {
    path: "daily-report",
    name: "admin-daily-report",
    loader: () =>
      import("@admin/features/daily-report").then((m) => ({
        default: m.DailyReport,
      })),
  },
  {
    path: "duty-chart",
    name: "admin-duty-chart",
    loader: () =>
      import("@admin/features/duty-chart").then((m) => ({
        default: m.DutyChart,
      })),
  },
  {
    path: "master-search",
    name: "admin-master-search",
    loader: () =>
      import("@admin/features/master-search").then((m) => ({
        default: m.MasterSearch,
      })),
  },
  {
    path: "master-report",
    name: "admin-master-report",
    loader: () =>
      import("@admin/features/master-report").then((m) => ({
        default: m.MasterReport,
      })),
  },
  {
    path: "master/city",
    name: "admin-master-city",
    loader: () =>
      import("@admin/features/master/city").then((m) => ({
        default: m.MasterCity,
      })),
  },
  {
    path: "master/state",
    name: "admin-master-state",
    loader: () =>
      import("@admin/features/master/state").then((m) => ({
        default: m.MasterState,
      })),
  },
  {
    path: "master/qualification",
    name: "admin-master-qualification",
    loader: () =>
      import("@admin/features/master/qualification").then((m) => ({
        default: m.MasterQualification,
      })),
  },
  {
    path: "master/department",
    name: "admin-master-department",
    loader: () =>
      import("@admin/features/master/department").then((m) => ({
        default: m.MasterDepartment,
      })),
  },
  {
    path: "master/availability",
    name: "admin-master-availability",
    loader: () =>
      import("@admin/features/master/availability").then((m) => ({
        default: m.MasterAvailability,
      })),
  },
  {
    path: "master/shift-time",
    name: "admin-master-shift-time",
    loader: () =>
      import("@admin/features/master/shift-time").then((m) => ({
        default: m.MasterShiftTime,
      })),
  },
  {
    path: "free-health-checkup",
    name: "admin-free-health-checkup",
    loader: () =>
      import("@admin/features/free-health-checkup").then((m) => ({
        default: m.FreeHealthCheckup,
      })),
  },
  {
    path: "blood-donation",
    name: "admin-blood-donation",
    loader: () =>
      import("@admin/features/blood-donation").then((m) => ({
        default: m.BloodDonation,
      })),
  },
  {
    path: "patients",
    name: "admin-patients",
    loader: () =>
      import("@admin/features/patients").then((m) => ({
        default: m.Patients,
      })),
  },
  {
    path: "profile",
    name: "admin-profile",
    loader: () =>
      import("@admin/features/profile").then((m) => ({
        default: m.Profile,
      })),
  },
];
