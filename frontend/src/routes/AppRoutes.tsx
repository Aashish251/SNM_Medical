import React, { Suspense } from "react";
import { Routes } from "react-router-dom";
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import LoadingSpinner from "@shared/components/LoadingSpinner";

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {PublicRoutes}
                {ProtectedRoutes}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
