import React, { Suspense } from "react";
import { Routes } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { AdminPanelRoutes } from "@admin-panel/routes/AdminPanelRoutes";
import LoadingSpinner from "@shared/components/LoadingSpinner";

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {PublicRoutes}
                {ProtectedRoutes}
                {AdminPanelRoutes}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
