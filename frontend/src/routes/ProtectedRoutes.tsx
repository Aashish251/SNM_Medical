import {
  SNM_NAV_ADMIN_DAILY_REPORT_LINK,
  SNM_NAV_ADMIN_DASHBOARD_LINK,
  SNM_NAV_ADMIN_DUTY_CHART_LINK,
  SNM_NAV_ADMIN_MASTER_REPORT_LINK,
  SNM_NAV_ADMIN_MASTER_SEARCH_LINK,
  SNM_NAV_ADMIN_REGISTRATION_REPORT_LINK,
  SNM_NAV_ADMIN_UPDATE_PROFILE_LINK,
  SNM_NAV_MS_DASHBOARD_LINK,
  SNM_NAV_MS_UPDATE_PROFILE_LINK,
} from "@shared/constants";
import { createProtectedRoutes } from "@app/router/createProtectedRoute";

export const ProtectedRoutes = createProtectedRoutes([
  {
    path: SNM_NAV_MS_DASHBOARD_LINK,
    name: "ms-dashboard",
    loader: () => import("@pages/protected/ms/dashboard"),
  },
  {
    path: SNM_NAV_MS_UPDATE_PROFILE_LINK,
    name: "ms-update-profile",
    loader: () => import("@pages/protected/update-profile"),
  },
  {
    path: SNM_NAV_ADMIN_DASHBOARD_LINK,
    name: "admin-dashboard",
    loader: () => import("@pages/protected/admin/dashboard"),
  },
  {
    path: SNM_NAV_ADMIN_DUTY_CHART_LINK,
    name: "admin-duty-chart",
    loader: () => import("@pages/protected/admin/duty-chart"),
  },
  {
    path: SNM_NAV_ADMIN_UPDATE_PROFILE_LINK,
    name: "admin-update-profile",
    loader: () => import("@pages/protected/update-profile"),
  },
  {
    path: SNM_NAV_ADMIN_MASTER_SEARCH_LINK,
    name: "admin-master-search",
    loader: () => import("@pages/protected/admin/master-search"),
  },
  {
    path: SNM_NAV_ADMIN_DAILY_REPORT_LINK,
    name: "admin-daily-report",
    loader: () => import("@pages/protected/admin/daily-report"),
  },
  {
    path: SNM_NAV_ADMIN_REGISTRATION_REPORT_LINK,
    name: "admin-registration-report",
    loader: () => import("@pages/protected/admin/registration-report"),
  },
  {
    path: SNM_NAV_ADMIN_MASTER_REPORT_LINK,
    name: "admin-master-report",
    loader: () => import("@pages/protected/admin/master-report"),
  },
]);
