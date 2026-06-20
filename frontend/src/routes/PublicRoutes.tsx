import {
  SNM_NAV_BLOOD_DONATION_LINK,
  SNM_NAV_CONTACT_LINK,
  SNM_NAV_FORGOT_PASSWORD_LINK,
  SNM_NAV_FREE_HEALTH_CHECKUPS_LINK,
  SNM_NAV_HOME_LINK,
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_PATIENT_REGISTRATION_LINK,
  SNM_NAV_REGISTER_LINK,
} from "@shared/constants";
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import AuthRedirect from "./AuthRedirect";
import { withPageErrorBoundary } from "@shared/error";

const LandingPage = lazy(() => import("@pages/public/landing"));
const Contact = lazy(() => import("@pages/public/contact"));
const Login = lazy(() => import("@pages/public/login"));
const Register = lazy(() => import("@pages/public/register"));
const ForgetPassword = lazy(() => import("@pages/public/forgot-password"));
const BloodDonation = lazy(() => import("@pages/public/blood-donation"));
const FreeHealthCheckups = lazy(() => import("@pages/public/free-health-checkups"));
const PatientRegistration = lazy(() => import("@pages/public/patient-registration"));
const NotFound = lazy(() => import("@pages/public/not-found"));

export const PublicRoutes = [
  <Route
    path={SNM_NAV_HOME_LINK}
    element={withPageErrorBoundary(<LandingPage />, "landing")}
  />,
  <Route
    path={SNM_NAV_BLOOD_DONATION_LINK}
    element={withPageErrorBoundary(<BloodDonation />, "blood-donation")}
  />,
  <Route
    path={SNM_NAV_FREE_HEALTH_CHECKUPS_LINK}
    element={withPageErrorBoundary(<FreeHealthCheckups />, "free-health-checkups")}
  />,
  <Route
    path={SNM_NAV_PATIENT_REGISTRATION_LINK}
    element={withPageErrorBoundary(<PatientRegistration />, "patient-registration")}
  />,
  <Route
    path={SNM_NAV_CONTACT_LINK}
    element={withPageErrorBoundary(<Contact />, "contact")}
  />,
  <Route
    path={SNM_NAV_LOGIN_LINK}
    element={withPageErrorBoundary(
      <AuthRedirect>
        <Login />
      </AuthRedirect>,
      "login"
    )}
  />,
  <Route
    path={SNM_NAV_REGISTER_LINK}
    element={withPageErrorBoundary(<Register />, "register")}
  />,
  <Route
    path={SNM_NAV_FORGOT_PASSWORD_LINK}
    element={withPageErrorBoundary(<ForgetPassword />, "forgot-password")}
  />,
  <Route
    key="notfound"
    path="*"
    element={withPageErrorBoundary(<NotFound />, "not-found")}
  />,
];
