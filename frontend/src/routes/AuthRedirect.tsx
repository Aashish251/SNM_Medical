import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  SNM_NAV_MS_DASHBOARD_LINK,
  SNM_NAV_ADMIN_DASHBOARD_LINK,
  SNM_MS_USERTYPE,
  SNM_ADMIN_USERTYPE,
} from "@shared/constants";
import { RootState } from "@app/store";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, userType } = useSelector(
    (state: RootState) => state.auth
  );

  // If user is already logged in, redirect based on type
  if (isSignedIn) {
    if (userType === SNM_MS_USERTYPE) {
      return <Navigate to={SNM_NAV_MS_DASHBOARD_LINK} replace />;
    } else {
      return <Navigate to={SNM_NAV_ADMIN_DASHBOARD_LINK} replace />;
    }
  }

  if (userType === SNM_ADMIN_USERTYPE) {
    return <Navigate to={SNM_NAV_ADMIN_DASHBOARD_LINK} replace />;
  }
  if (userType === SNM_MS_USERTYPE) {
    return <Navigate to={SNM_NAV_MS_DASHBOARD_LINK} replace />;
  }

  // Otherwise show the actual login page
  return <>{children}</>;
};

export default AuthRedirect;
