import React, { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Dashboard = lazy(() => import("@features/dashboard"));
const DutyChart = lazy(() => import("@features/duty-chart"));

export const ProtectedRoutes = [
  <Route
    key="dashboard"
    path="/admin/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="duty-chart"
    path="/admin/duty-chart"
    element={
      <ProtectedRoute>
        <DutyChart />
      </ProtectedRoute>
    }
  />,
];
