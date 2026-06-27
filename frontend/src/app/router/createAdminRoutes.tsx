import React, { lazy, Suspense } from "react";
import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import { AdminLayout } from "@admin/layouts/AdminLayout";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { ROUTE_ADMIN_BASE } from "./routePaths";
import { adminRouteEntries } from "./adminRouteEntries";

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
);

export function createAdminRoutes() {
  const childRoutes = adminRouteEntries.map(({ path, loader }) => {
    const Page = lazy(loader);
    return (
      <Route
        key={path}
        path={path}
        element={withSuspense(<Page />)}
      />
    );
  });

  return (
    <Route
      path={ROUTE_ADMIN_BASE}
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      {childRoutes}
    </Route>
  );
}

export const AdminRoutes = createAdminRoutes();
