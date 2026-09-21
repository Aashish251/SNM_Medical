import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PageErrorBoundary } from "./ErrorBoundary";

export function RouteErrorBoundary({
  children,
  name,
}: {
  children: ReactNode;
  name: string;
}) {
  const location = useLocation();

  return (
    <PageErrorBoundary name={name} routePath={location.pathname}>
      {children}
    </PageErrorBoundary>
  );
}

export function withPageErrorBoundary(element: ReactNode, name: string) {
  return <RouteErrorBoundary name={name}>{element}</RouteErrorBoundary>;
}
