import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import type { RouteMeta } from "@app/router/routeMeta";
import {
  SNM_NAV_LOGIN_LINK,
  SNM_NAV_HOME_LINK,
} from "@shared/constants";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RouteMeta["requiredRoles"];
  routeMeta?: RouteMeta;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  routeMeta,
}) => {
  const { isSignedIn, userType } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const roles = allowedRoles ?? routeMeta?.requiredRoles;

  useEffect(() => {
    if (routeMeta?.title) {
      document.title = `${routeMeta.title} | SNM Medical`;
    }
  }, [routeMeta?.title]);

  if (!isSignedIn) {
    return <Navigate to={SNM_NAV_LOGIN_LINK} replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(userType as "admin" | "ms")) {
    return <Navigate to={SNM_NAV_HOME_LINK} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
