import {
  SNM_ADMIN_USERTYPE,
  SNM_MS_USERTYPE,
} from "@shared/constants";
import {
  ROUTE_ADMIN_DASHBOARD,
  ROUTE_MS_ADMIN_DASHBOARD,
} from "./routePaths";

/**
 * Returns the default post-authentication route for a given user role.
 *
 * Medical Staff  → /ms-admin/dashboard
 * Administrator  → /admin/dashboard
 */
export function getDefaultRouteForUserType(userType?: string): string {
  if (userType === SNM_MS_USERTYPE) {
    return ROUTE_MS_ADMIN_DASHBOARD;
  }
  if (userType === SNM_ADMIN_USERTYPE) {
    return ROUTE_ADMIN_DASHBOARD;
  }
  return ROUTE_MS_ADMIN_DASHBOARD;
}
