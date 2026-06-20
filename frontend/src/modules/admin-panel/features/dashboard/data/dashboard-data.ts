import { imageMap } from "@shared/config/imageMap";
import { DEFAULT_PROFILE_IMAGE } from "@assets/index";
import {
  ADMIN_PANEL_DAILY_REPORT,
  ADMIN_PANEL_DUTY_CHART,
  ADMIN_PANEL_MASTER_SEARCH,
  ADMIN_PANEL_REGISTRATION_REPORT,
} from "@admin-panel/constants/routePaths";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  ClipboardList,
  Droplets,
  HeartPulse,
  Search,
  Stethoscope,
  UserPlus,
} from "lucide-react";

export type SummaryStat = {
  id: string;
  label: string;
  value: number;
  change?: string;
  icon: LucideIcon;
  color: string;
};

export type DepartmentStaff = {
  title: string;
  value: number;
  color: string;
  image: string;
};

export type RecentActivity = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "registration" | "camp" | "staff" | "report";
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const departmentStats: Omit<DepartmentStaff, "image">[] = [
  { title: "Nursing", value: 14, color: "#EC4899" },
  { title: "Pharmacy", value: 8, color: "#14B8A6" },
  { title: "Dressing", value: 7, color: "#3B82F6" },
  { title: "Doctors", value: 4, color: "#8B5CF6" },
  { title: "Pathology", value: 4, color: "#84CC16" },
  { title: "Physiotherapy", value: 4, color: "#2563EB" },
  { title: "Registration", value: 4, color: "#16A34A" },
  { title: "Accupressure", value: 1, color: "#06B6D4" },
  { title: "Homeopathy", value: 1, color: "#F43F5E" },
  { title: "Lab", value: 1, color: "#6366F1" },
  { title: "Ambulance", value: 0, color: "#EF4444" },
  { title: "Paramedical", value: 0, color: "#10B981" },
];

export const summaryStats: SummaryStat[] = [
  {
    id: "registrations",
    label: "Total Registrations",
    value: 1248,
    change: "+12% from last month",
    icon: ClipboardList,
    color: "var(--color-brand-primary)",
  },
  {
    id: "staff",
    label: "Active Staff",
    value: departmentStats.reduce((sum, d) => sum + d.value, 0),
    change: "Across 12 departments",
    icon: Stethoscope,
    color: "var(--color-brand-secondary)",
  },
  {
    id: "blood-donation",
    label: "Blood Donation Camps",
    value: 12,
    change: "3 scheduled this month",
    icon: Droplets,
    color: "#EF4444",
  },
  {
    id: "health-checkup",
    label: "Health Checkup Camps",
    value: 24,
    change: "6 completed this quarter",
    icon: HeartPulse,
    color: "#16A34A",
  },
];

export const departmentStaff: DepartmentStaff[] = departmentStats.map((dept) => ({
  ...dept,
  image: imageMap[dept.title] ?? DEFAULT_PROFILE_IMAGE,
}));

export const recentActivities: RecentActivity[] = [
  {
    id: "act-1",
    title: "New patient registration",
    description: "Rahul Sharma registered under General Medicine.",
    timestamp: "2 hours ago",
    type: "registration",
  },
  {
    id: "act-2",
    title: "Blood donation camp completed",
    description: "Chembur camp collected 45 units of blood.",
    timestamp: "5 hours ago",
    type: "camp",
  },
  {
    id: "act-3",
    title: "Staff duty assigned",
    description: "Dr. Amit Kumar assigned to Pediatrics morning shift.",
    timestamp: "Yesterday",
    type: "staff",
  },
  {
    id: "act-4",
    title: "Daily report submitted",
    description: "OPD Summary report for 2026-06-12 submitted.",
    timestamp: "Yesterday",
    type: "report",
  },
  {
    id: "act-5",
    title: "Health checkup camp scheduled",
    description: "Community outreach camp planned for 2026-06-20.",
    timestamp: "2 days ago",
    type: "camp",
  },
];

export const quickActions: QuickAction[] = [
  {
    id: "qa-1",
    title: "Add Registration",
    description: "Register a new patient record.",
    href: ADMIN_PANEL_REGISTRATION_REPORT,
    icon: UserPlus,
  },
  {
    id: "qa-2",
    title: "Duty Chart",
    description: "Manage staff duty assignments.",
    href: ADMIN_PANEL_DUTY_CHART,
    icon: CalendarDays,
  },
  {
    id: "qa-3",
    title: "Daily Report",
    description: "View and submit daily reports.",
    href: ADMIN_PANEL_DAILY_REPORT,
    icon: ClipboardList,
  },
  {
    id: "qa-4",
    title: "Master Search",
    description: "Search patient and staff records.",
    href: ADMIN_PANEL_MASTER_SEARCH,
    icon: Search,
  },
];

export const departmentChartData = {
  labels: departmentStaff.map((d) => d.title),
  values: departmentStaff.map((d) => d.value),
  colors: departmentStaff.map((d) => d.color),
};
