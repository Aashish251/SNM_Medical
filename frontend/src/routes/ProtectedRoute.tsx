import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@app/store";
import {
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_HOME_LINK,
  SNM_NAV_MS_DASHBOARD_LINK,
} from "@shared/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "ms")[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isSignedIn, userType } = useSelector((state: RootState) => state.auth);

  // Not signed in → redirect to login
  if (!isSignedIn) {
    return <Navigate to={SNM_NAV_LOGIN_LINK} replace />;
  }

  // Wrong role → redirect to homepage (or unauthorized page)
  if (allowedRoles && !allowedRoles.includes(userType as "admin" | "ms")) {
    return <Navigate to={SNM_NAV_HOME_LINK} replace />;
  }

  // Authorized → render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
