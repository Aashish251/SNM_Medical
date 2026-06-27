import { Navigate, Route } from "react-router-dom";
import {
  ROUTE_MS_ADMIN_DASHBOARD,
  ROUTE_MS_ADMIN_UPDATE_PROFILE,
  ROUTE_MS_DASHBOARD,
  ROUTE_MS_UPDATE_PROFILE,
} from "./routePaths";

/**
 * Backward-compatible redirects from deprecated /ms/* route prefix.
 */
export const LegacyRedirectRoutes = (
  <>
    <Route
      path={ROUTE_MS_DASHBOARD}
      element={<Navigate to={ROUTE_MS_ADMIN_DASHBOARD} replace />}
    />
    <Route
      path={ROUTE_MS_UPDATE_PROFILE}
      element={<Navigate to={ROUTE_MS_ADMIN_UPDATE_PROFILE} replace />}
    />
  </>
);
