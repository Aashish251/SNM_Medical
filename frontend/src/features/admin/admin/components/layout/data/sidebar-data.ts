import {
  ROUTE_ADMIN_DAILY_REPORT,
  ROUTE_ADMIN_DASHBOARD,
  ROUTE_ADMIN_DUTY_CHART,
  ROUTE_ADMIN_MASTER_REPORT,
  ROUTE_ADMIN_MASTER_SEARCH,
  ROUTE_ADMIN_MASTER_AVAILABILITY,
  ROUTE_ADMIN_MASTER_CITY,
  ROUTE_ADMIN_MASTER_DEPARTMENT,
  ROUTE_ADMIN_MASTER_QUALIFICATION,
  ROUTE_ADMIN_MASTER_SHIFT_TIME,
  ROUTE_ADMIN_MASTER_STATE,
  ROUTE_ADMIN_REGISTRATION_REPORT,
  ROUTE_ADMIN_USERS,
  ROUTE_ADMIN_FREE_HEALTH_CHECKUP,
  ROUTE_ADMIN_BLOOD_DONATION,
  ROUTE_ADMIN_PROFILE,
} from "@admin/constants/routePaths";
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
          url: ROUTE_ADMIN_DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          title: "Users",
          url: ROUTE_ADMIN_USERS,
          icon: Users,
        },
        {
          title: "Duty Chart",
          url: ROUTE_ADMIN_DUTY_CHART,
          icon: CalendarClock,
        },
        {
          title: "Master Search",
          url: ROUTE_ADMIN_MASTER_SEARCH,
          icon: Search,
        },
        {
          title: "Master",
          icon: Database,
          items: [
            {
              title: "City",
              url: ROUTE_ADMIN_MASTER_CITY,
              icon: MapPin,
            },
            {
              title: "State",
              url: ROUTE_ADMIN_MASTER_STATE,
              icon: Map,
            },
            {
              title: "Qualification",
              url: ROUTE_ADMIN_MASTER_QUALIFICATION,
              icon: GraduationCap,
            },
            {
              title: "Department",
              url: ROUTE_ADMIN_MASTER_DEPARTMENT,
              icon: Building2,
            },
            {
              title: "Availability",
              url: ROUTE_ADMIN_MASTER_AVAILABILITY,
              icon: CalendarCheck,
            },
            {
              title: "Shift Time",
              url: ROUTE_ADMIN_MASTER_SHIFT_TIME,
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
              url: ROUTE_ADMIN_REGISTRATION_REPORT,
              icon: ClipboardList,
            },
            {
              title: "Daily Report",
              url: ROUTE_ADMIN_DAILY_REPORT,
              icon: CalendarDays,
            },
            {
              title: "Master Report",
              url: ROUTE_ADMIN_MASTER_REPORT,
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
              url: ROUTE_ADMIN_FREE_HEALTH_CHECKUP,
              icon: Stethoscope,
            },
            {
              title: "Blood Donation",
              url: ROUTE_ADMIN_BLOOD_DONATION,
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
          url: ROUTE_ADMIN_PROFILE,
          icon: UserCog,
        },
      ],
    },
  ],
};
