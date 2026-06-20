import {
  SNM_NAV_ADMIN_DAILY_REPORT_LINK,
  SNM_NAV_ADMIN_DASHBOARD_LINK,
  SNM_NAV_ADMIN_DUTY_CHART_LINK,
  SNM_NAV_ADMIN_MASTER_REPORT_LINK,
  SNM_NAV_ADMIN_MASTER_SEARCH_LINK,
  SNM_NAV_ADMIN_REGISTRATION_REPORT_LINK,
  SNM_NAV_ADMIN_UPDATE_PROFILE_LINK,
  SNM_NAV_BLOOD_DONATION_LINK,
  SNM_NAV_CONTACT_LINK,
  SNM_NAV_FORGOT_PASSWORD_LINK,
  SNM_NAV_FREE_HEALTH_CHECKUPS_LINK,
  SNM_NAV_HOME_LINK,
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_MS_DASHBOARD_LINK,
  SNM_NAV_MS_UPDATE_PROFILE_LINK,
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
  { path: SNM_NAV_MS_DASHBOARD_LINK, title: "Medical Staff Dashboard", access: "protected", requiredRoles: ["ms"], layout: "dashboard" },
  { path: SNM_NAV_MS_UPDATE_PROFILE_LINK, title: "Update Profile", access: "protected", requiredRoles: ["ms", "admin"], layout: "dashboard" },
  { path: SNM_NAV_ADMIN_DASHBOARD_LINK, title: "Admin Dashboard", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: SNM_NAV_ADMIN_DUTY_CHART_LINK, title: "Duty Chart", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: SNM_NAV_ADMIN_UPDATE_PROFILE_LINK, title: "Update Profile", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: SNM_NAV_ADMIN_MASTER_SEARCH_LINK, title: "Master Search", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: SNM_NAV_ADMIN_DAILY_REPORT_LINK, title: "Daily Report", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: SNM_NAV_ADMIN_REGISTRATION_REPORT_LINK, title: "Registration Report", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
  { path: SNM_NAV_ADMIN_MASTER_REPORT_LINK, title: "Master Report", access: "protected", requiredRoles: ["admin"], layout: "dashboard" },
];

export function getRouteMeta(path: string) {
  return routeMeta.find((route) => route.path === path);
}
