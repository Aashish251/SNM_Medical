import React, { Suspense } from "react";
import { Routes } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { AdminRoutes } from "@app/router/createAdminRoutes";
import { LegacyRedirectRoutes } from "@app/router/legacyRedirectRoutes";
import LoadingSpinner from "@shared/components/LoadingSpinner";

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {PublicRoutes}
                {LegacyRedirectRoutes}
                {ProtectedRoutes}
                {AdminRoutes}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
