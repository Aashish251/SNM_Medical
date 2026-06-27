import {
  ROUTE_ADMIN_BLOOD_DONATION,
  ROUTE_ADMIN_DAILY_REPORT,
  ROUTE_ADMIN_DASHBOARD,
  ROUTE_ADMIN_DUTY_CHART,
  ROUTE_ADMIN_FREE_HEALTH_CHECKUP,
  ROUTE_ADMIN_MASTER_AVAILABILITY,
  ROUTE_ADMIN_MASTER_CITY,
  ROUTE_ADMIN_MASTER_DEPARTMENT,
  ROUTE_ADMIN_MASTER_QUALIFICATION,
  ROUTE_ADMIN_MASTER_REPORT,
  ROUTE_ADMIN_MASTER_SEARCH,
  ROUTE_ADMIN_MASTER_SHIFT_TIME,
  ROUTE_ADMIN_MASTER_STATE,
  ROUTE_ADMIN_PROFILE,
  ROUTE_ADMIN_REGISTRATION_REPORT,
  ROUTE_ADMIN_USERS,
  ROUTE_MS_ADMIN_DAILY_REPORT,
  ROUTE_MS_ADMIN_DASHBOARD,
  ROUTE_MS_ADMIN_DUTY_CHART,
  ROUTE_MS_ADMIN_MASTER_REPORT,
  ROUTE_MS_ADMIN_MASTER_SEARCH,
  ROUTE_MS_ADMIN_REGISTRATION_REPORT,
  ROUTE_MS_ADMIN_UPDATE_PROFILE,
} from "./routePaths";
import {
  SNM_NAV_BLOOD_DONATION_LINK,
  SNM_NAV_CONTACT_LINK,
  SNM_NAV_FORGOT_PASSWORD_LINK,
  SNM_NAV_FREE_HEALTH_CHECKUPS_LINK,
  SNM_NAV_HOME_LINK,
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_PATIENT_REGISTRATION_LINK,
  SNM_NAV_REGISTER_LINK,
} from "@shared/constants";

export type UserRole = "admin" | "ms";

export type RouteMeta = {
  path: string;
  title: string;
  access: "public" | "guest" | "protected";
  requiredRoles?: UserRole[];
  layout: "public" | "dashboard";
  showInNavigation?: boolean;
};

export const routeMeta: RouteMeta[] = [
  { path: SNM_NAV_HOME_LINK, title: "Home", access: "public", layout: "public" },
  { path: SNM_NAV_BLOOD_DONATION_LINK, title: "Blood Donation", access: "public", layout: "public" },
  { path: SNM_NAV_FREE_HEALTH_CHECKUPS_LINK, title: "Free Health Check-ups", access: "public", layout: "public" },
  { path: SNM_NAV_PATIENT_REGISTRATION_LINK, title: "Patient Registration", access: "public", layout: "public" },
  { path: SNM_NAV_CONTACT_LINK, title: "Contact", access: "public", layout: "public" },
  { path: SNM_NAV_LOGIN_LINK, title: "Login", access: "guest", layout: "public" },
  { path: SNM_NAV_REGISTER_LINK, title: "Register", access: "public", layout: "public" },
  { path: SNM_NAV_FORGOT_PASSWORD_LINK, title: "Forgot Password", access: "guest", layout: "public" },
  // Medical Staff Admin (/ms-admin/*)
  { path: ROUTE_MS_ADMIN_DASHBOARD, title: "Medical Staff Dashboard", access: "protected", requiredRoles: ["ms"], layout: "dashboard" },
  { path: ROUTE_MS_ADMIN_UPDATE_PROFILE, title: "Update Profile", access: "protected", requiredRoles: ["ms", "admin"], layout: "dashboard" },
  { path: ROUTE_MS_ADMIN_DUTY_CHART, title: "Duty Chart", access: "protected", requiredRoles: ["ms"], layout: "dashboard" },
  { path: ROUTE_MS_ADMIN_MASTER_SEARCH, title: "Master Search", access: "protected", requiredRoles: ["ms"], layout: "dashboard" },
  { path: ROUTE_MS_ADMIN_DAILY_REPORT, title: "Daily Report", access: "protected", requiredRoles: ["ms"], layout: "dashboard" },
  { path: ROUTE_MS_ADMIN_REGISTRATION_REPORT, title: "Registration Report", access: "protected", requiredRoles: ["ms"], layout: "dashboard" },
  { path: ROUTE_MS_ADMIN_MASTER_REPORT, title: "Master Report", access: "protected", requiredRoles: ["ms"], layout: "dashboard" },
  // Administrator Portal (/admin/*)
  { path: ROUTE_ADMIN_DASHBOARD, title: "Administrator Dashboard", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_USERS, title: "Users", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_DUTY_CHART, title: "Duty Chart", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_SEARCH, title: "Master Search", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_DAILY_REPORT, title: "Daily Report", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_REGISTRATION_REPORT, title: "Registration Report", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_REPORT, title: "Master Report", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_FREE_HEALTH_CHECKUP, title: "Free Health Checkup", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_BLOOD_DONATION, title: "Blood Donation", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_PROFILE, title: "Profile", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_CITY, title: "Master — City", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_STATE, title: "Master — State", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_QUALIFICATION, title: "Master — Qualification", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_DEPARTMENT, title: "Master — Department", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_AVAILABILITY, title: "Master — Availability", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: ROUTE_ADMIN_MASTER_SHIFT_TIME, title: "Master — Shift Time", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
];

export function getRouteMeta(path: string) {
  return routeMeta.find((route) => route.path === path);
}
