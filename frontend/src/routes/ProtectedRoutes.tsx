import React, { lazy } from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
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
} from "@shared/constants/index.constant";

// common pages
const UpdateProfile = lazy(() => import("@features/update-profile"));

// Medical Staff
const MSDashboard = lazy(() => import("@features/medical-staff/msdashboard"));

// Admin
const AdminDashboard = lazy(() => import("@features/admin/dashboard"));
const AdminDutyChart = lazy(() => import("@features/admin/duty-chart"));
const AdminMasterSearch = lazy(() => import("@features/admin/master-search"));
const AdminMasterReport = lazy(() => import("@features/admin/master-report"));
const AdminDailyReport = lazy(() => import("@features/admin/daily-report"));
const AdminRegistrationReport = lazy(
  () => import("@features/admin/registration-report")
);

export const ProtectedRoutes = [
  // Medical Staff routes
  <Route
    path={SNM_NAV_MS_DASHBOARD_LINK}
    element={
      <ProtectedRoute allowedRole="ms">
        <MSDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    path={`${SNM_NAV_MS_UPDATE_PROFILE_LINK}/:id`}
    element={
      <ProtectedRoute allowedRole="ms">
        <UpdateProfile />
      </ProtectedRoute>
    }
  />,

  // Admin routes
  <Route
    path={SNM_NAV_ADMIN_DASHBOARD_LINK}
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    path={SNM_NAV_ADMIN_DUTY_CHART_LINK}
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminDutyChart />
      </ProtectedRoute>
    }
  />,
  <Route
    path={`${SNM_NAV_ADMIN_UPDATE_PROFILE_LINK}/:id`}
    element={
      <ProtectedRoute allowedRole="admin">
        <UpdateProfile />
      </ProtectedRoute>
    }
  />,
  <Route
    path={SNM_NAV_ADMIN_MASTER_SEARCH_LINK}
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminMasterSearch />
      </ProtectedRoute>
    }
  />,
  <Route
    path={SNM_NAV_ADMIN_DAILY_REPORT_LINK}
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminDailyReport />
      </ProtectedRoute>
    }
  />,
  <Route
    path={SNM_NAV_ADMIN_REGISTRATION_REPORT_LINK}
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminRegistrationReport />
      </ProtectedRoute>
    }
  />,
  <Route
    path={SNM_NAV_ADMIN_MASTER_REPORT_LINK}
    element={
      <ProtectedRoute allowedRole="admin">
        <AdminMasterReport />
      </ProtectedRoute>
    }
  />,
];
