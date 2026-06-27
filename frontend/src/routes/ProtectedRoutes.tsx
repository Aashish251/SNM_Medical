import { createProtectedRoutes } from "@app/router/createProtectedRoute";
import { legacyProtectedRouteEntries } from "@app/router/protectedRouteEntries";

export const ProtectedRoutes = createProtectedRoutes(legacyProtectedRouteEntries);
