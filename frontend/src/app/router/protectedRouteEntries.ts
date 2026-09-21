import {
  ROUTE_MS_ADMIN_DAILY_REPORT,
  ROUTE_MS_ADMIN_DASHBOARD,
  ROUTE_MS_ADMIN_DUTY_CHART,
  ROUTE_MS_ADMIN_MASTER_REPORT,
  ROUTE_MS_ADMIN_MASTER_SEARCH,
  ROUTE_MS_ADMIN_REGISTRATION_REPORT,
  ROUTE_MS_ADMIN_UPDATE_PROFILE,
} from "./routePaths";

export type ProtectedRouteEntry = {
  path: string;
  name: string;
  loader: () => Promise<{ default: import("react").ComponentType }>;
};

/**
 * Medical Staff admin routes served under /ms-admin/* with header-nav layout.
 */
export const legacyProtectedRouteEntries: ProtectedRouteEntry[] = [
  {
    path: ROUTE_MS_ADMIN_DASHBOARD,
    name: "ms-admin-dashboard",
    loader: () => import("@pages/protected/ms-admin/dashboard"),
  },
  {
    path: ROUTE_MS_ADMIN_UPDATE_PROFILE,
    name: "ms-admin-update-profile",
    loader: () => import("@pages/protected/update-profile"),
  },
  {
    path: ROUTE_MS_ADMIN_DUTY_CHART,
    name: "ms-admin-duty-chart",
    loader: () => import("@pages/protected/ms-admin/duty-chart"),
  },
  {
    path: ROUTE_MS_ADMIN_MASTER_SEARCH,
    name: "ms-admin-master-search",
    loader: () => import("@pages/protected/ms-admin/master-search"),
  },
  {
    path: ROUTE_MS_ADMIN_DAILY_REPORT,
    name: "ms-admin-daily-report",
    loader: () => import("@pages/protected/ms-admin/daily-report"),
  },
  {
    path: ROUTE_MS_ADMIN_REGISTRATION_REPORT,
    name: "ms-admin-registration-report",
    loader: () => import("@pages/protected/ms-admin/registration-report"),
  },
  {
    path: ROUTE_MS_ADMIN_MASTER_REPORT,
    name: "ms-admin-master-report",
    loader: () => import("@pages/protected/ms-admin/master-report"),
  },
];
