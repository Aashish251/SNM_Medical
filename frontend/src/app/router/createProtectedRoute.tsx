import React, { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import { getRouteMeta, type RouteMeta } from "./routeMeta";
import { RouteErrorBoundary } from "@shared/error";

type LazyPage = LazyExoticComponent<ComponentType>;

export function createProtectedRoute(path: string, Page: LazyPage, routeName: string) {
  const meta = getRouteMeta(path);

  return (
    <Route
      key={path}
      path={path}
      element={
        <ProtectedRoute
          allowedRoles={meta?.requiredRoles}
          routeMeta={meta}
        >
          <RouteErrorBoundary name={routeName}>
            <Page />
          </RouteErrorBoundary>
        </ProtectedRoute>
      }
    />
  );
}

export function createProtectedRoutes(
  entries: Array<{
    path: string;
    name: string;
    loader: () => Promise<{ default: ComponentType }>;
  }>
) {
  return entries.map(({ path, name, loader }) => {
    const Page = lazy(loader);
    return createProtectedRoute(path, Page, name);
  });
}

export type { RouteMeta };
