import {
  SNM_NAV_CONTACT_LINK,
  SNM_NAV_FORGOT_PASSWORD_LINK,
  SNM_NAV_HOME_LINK,
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_REGISTER_LINK,
} from "@shared/constants/index.constant";
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import AuthRedirect from "./AuthRedirect";

const LandingPage = lazy(() => import("@features/landing-page"));
const Contact = lazy(() => import("@features/contact"));
const Login = lazy(() => import("@features/login"));
const Register = lazy(() => import("@features/register"));
const ForgetPassword = lazy(() => import("@features/forgot-password"));
const NotFound = lazy(() => import("@features/not-found"));

export const PublicRoutes = [
  <Route path={SNM_NAV_HOME_LINK} element={<LandingPage />} />,
  <Route path={SNM_NAV_CONTACT_LINK} element={<Contact />} />,
  <Route
    path={SNM_NAV_LOGIN_LINK}
    element={
      <AuthRedirect>
        <Login />
      </AuthRedirect>
    }
  />,
  <Route path={SNM_NAV_REGISTER_LINK} element={<Register />} />,
  <Route path={SNM_NAV_FORGOT_PASSWORD_LINK} element={<ForgetPassword />} />,
  <Route key="notfound" path="*" element={<NotFound />} />,
];
