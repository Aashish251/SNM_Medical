import {
  ADMIN_PANEL_DAILY_REPORT,
  ADMIN_PANEL_DASHBOARD,
  ADMIN_PANEL_DUTY_CHART,
  ADMIN_PANEL_MASTER_REPORT,
  ADMIN_PANEL_MASTER_SEARCH,
  ADMIN_PANEL_MASTER_AVAILABILITY,
  ADMIN_PANEL_MASTER_CITY,
  ADMIN_PANEL_MASTER_DEPARTMENT,
  ADMIN_PANEL_MASTER_QUALIFICATION,
  ADMIN_PANEL_MASTER_SHIFT_TIME,
  ADMIN_PANEL_MASTER_STATE,
  ADMIN_PANEL_REGISTRATION_REPORT,
  ADMIN_PANEL_USERS,
  ADMIN_PANEL_FREE_HEALTH_CHECKUP,
  ADMIN_PANEL_BLOOD_DONATION,
  ADMIN_PANEL_PROFILE,
} from "@admin-panel/constants/routePaths";
import { type SidebarData } from "../types";
import {
  LayoutDashboard,
  Users,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  ClipboardList,
  CalendarDays,
  CalendarClock,
  Search,
  FileSpreadsheet,
  MapPin,
  Map,
  GraduationCap,
  Building2,
  CalendarCheck,
  Clock,
  Database,
  Stethoscope,
  Droplet,
  Tent,
  UserCog,
} from "lucide-react";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: ADMIN_PANEL_DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          title: "Users",
          url: ADMIN_PANEL_USERS,
          icon: Users,
        },
        {
          title: "Duty Chart",
          url: ADMIN_PANEL_DUTY_CHART,
          icon: CalendarClock,
        },
        {
          title: "Master Search",
          url: ADMIN_PANEL_MASTER_SEARCH,
          icon: Search,
        },
        {
          title: "Master",
          icon: Database,
          items: [
            {
              title: "City",
              url: ADMIN_PANEL_MASTER_CITY,
              icon: MapPin,
            },
            {
              title: "State",
              url: ADMIN_PANEL_MASTER_STATE,
              icon: Map,
            },
            {
              title: "Qualification",
              url: ADMIN_PANEL_MASTER_QUALIFICATION,
              icon: GraduationCap,
            },
            {
              title: "Department",
              url: ADMIN_PANEL_MASTER_DEPARTMENT,
              icon: Building2,
            },
            {
              title: "Availability",
              url: ADMIN_PANEL_MASTER_AVAILABILITY,
              icon: CalendarCheck,
            },
            {
              title: "Shift Time",
              url: ADMIN_PANEL_MASTER_SHIFT_TIME,
              icon: Clock,
            },
          ],
        },
        {
          title: "All Reports",
          icon: FileSpreadsheet,
          items: [
            {
              title: "Registration Report",
              url: ADMIN_PANEL_REGISTRATION_REPORT,
              icon: ClipboardList,
            },
            {
              title: "Daily Report",
              url: ADMIN_PANEL_DAILY_REPORT,
              icon: CalendarDays,
            },
            {
              title: "Master Report",
              url: ADMIN_PANEL_MASTER_REPORT,
              icon: FileSpreadsheet,
            },
          ],
        },
        {
          title: "Camps",
          icon: Tent,
          items: [
            {
              title: "Free Health Checkup",
              url: ADMIN_PANEL_FREE_HEALTH_CHECKUP,
              icon: Stethoscope,
            },
            {
              title: "Blood Donation",
              url: ADMIN_PANEL_BLOOD_DONATION,
              icon: Droplet,
            },
          ],
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Profile",
          url: ADMIN_PANEL_PROFILE,
          icon: UserCog,
        },
      ],
    },
  ],
};
