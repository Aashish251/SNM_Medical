import React from "react";
import { Navigate } from "react-router-dom";
import { getDefaultRouteForUserType } from "@app/router/authRedirects";
import { useAppSelector } from "@app/store/hooks";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, userType } = useAppSelector((state) => state.auth);

  if (isSignedIn && userType) {
    return <Navigate to={getDefaultRouteForUserType(userType)} replace />;
  }

  return <>{children}</>;
};

export default AuthRedirect;
