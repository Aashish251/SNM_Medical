import React, { lazy, Suspense } from "react";
import { Navigate, Route } from "react-router-dom";
import ProtectedRoute from "@routes/ProtectedRoute";
import { AdminLayout } from "@admin-panel/layouts/AdminLayout";
import LoadingSpinner from "@shared/components/LoadingSpinner";
import { ADMIN_PANEL_BASE } from "@admin-panel/constants/routePaths";

const Dashboard = lazy(() =>
  import("@admin-panel/features/dashboard").then((m) => ({ default: m.Dashboard }))
);
const Users = lazy(() =>
  import("@admin-panel/features/users").then((m) => ({ default: m.Users }))
);
const RegistrationReport = lazy(() =>
  import("@admin-panel/features/registration-report").then((m) => ({
    default: m.RegistrationReport,
  }))
);
const DailyReport = lazy(() =>
  import("@admin-panel/features/daily-report").then((m) => ({
    default: m.DailyReport,
  }))
);
const DutyChart = lazy(() =>
  import("@admin-panel/features/duty-chart").then((m) => ({
    default: m.DutyChart,
  }))
);
const MasterSearch = lazy(() =>
  import("@admin-panel/features/master-search").then((m) => ({
    default: m.MasterSearch,
  }))
);
const MasterReport = lazy(() =>
  import("@admin-panel/features/master-report").then((m) => ({
    default: m.MasterReport,
  }))
);
const MasterCity = lazy(() =>
  import("@admin-panel/features/master/city").then((m) => ({ default: m.MasterCity }))
);
const MasterState = lazy(() =>
  import("@admin-panel/features/master/state").then((m) => ({ default: m.MasterState }))
);
const MasterQualification = lazy(() =>
  import("@admin-panel/features/master/qualification").then((m) => ({
    default: m.MasterQualification,
  }))
);
const MasterDepartment = lazy(() =>
  import("@admin-panel/features/master/department").then((m) => ({
    default: m.MasterDepartment,
  }))
);
const MasterAvailability = lazy(() =>
  import("@admin-panel/features/master/availability").then((m) => ({
    default: m.MasterAvailability,
  }))
);
const MasterShiftTime = lazy(() =>
  import("@admin-panel/features/master/shift-time").then((m) => ({
    default: m.MasterShiftTime,
  }))
);
const FreeHealthCheckup = lazy(() =>
  import("@admin-panel/features/free-health-checkup").then((m) => ({
    default: m.FreeHealthCheckup,
  }))
);
const BloodDonation = lazy(() =>
  import("@admin-panel/features/blood-donation").then((m) => ({
    default: m.BloodDonation,
  }))
);
const Profile = lazy(() =>
  import("@admin-panel/features/profile").then((m) => ({ default: m.Profile }))
);

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingSpinner />}>{element}</Suspense>
);

export const AdminPanelRoutes = (
  <>
    <Route
      path={ADMIN_PANEL_BASE}
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={withSuspense(<Dashboard />)} />
      <Route path="users" element={withSuspense(<Users />)} />
      <Route
        path="registration-report"
        element={withSuspense(<RegistrationReport />)}
      />
      <Route path="daily-report" element={withSuspense(<DailyReport />)} />
      <Route path="duty-chart" element={withSuspense(<DutyChart />)} />
      <Route path="master-search" element={withSuspense(<MasterSearch />)} />
      <Route path="master-report" element={withSuspense(<MasterReport />)} />
      <Route path="master/city" element={withSuspense(<MasterCity />)} />
      <Route path="master/state" element={withSuspense(<MasterState />)} />
      <Route
        path="master/qualification"
        element={withSuspense(<MasterQualification />)}
      />
      <Route
        path="master/department"
        element={withSuspense(<MasterDepartment />)}
      />
      <Route
        path="master/availability"
        element={withSuspense(<MasterAvailability />)}
      />
      <Route
        path="master/shift-time"
        element={withSuspense(<MasterShiftTime />)}
      />
      <Route
        path="free-health-checkup"
        element={withSuspense(<FreeHealthCheckup />)}
      />
      <Route path="blood-donation" element={withSuspense(<BloodDonation />)} />
      <Route path="profile" element={withSuspense(<Profile />)} />
    </Route>
  </>
);
