import React from "react";
import { SNM_NAV_HOME_LINK } from "@shared/constants";
import { logBoundaryError } from "./errorLogger";
import {
  GlobalErrorFallback,
  PageErrorFallback,
  WidgetErrorFallback,
} from "./ErrorFallback";
import type { ErrorBoundaryLevel } from "./types";

export type ErrorBoundaryProps = {
  children: React.ReactNode;
  level?: ErrorBoundaryLevel;
  name?: string;
  routePath?: string;
  fallback?: React.ReactNode;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logBoundaryError(error, {
      level: this.props.level ?? "app",
      boundaryName: this.props.name,
      componentStack: info.componentStack,
      routePath: this.props.routePath,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.assign(SNM_NAV_HOME_LINK);
  };

  private renderDefaultFallback() {
    const level = this.props.level ?? "app";

    if (this.props.fallback) {
      return this.props.fallback;
    }

    switch (level) {
      case "page":
        return (
          <PageErrorFallback
            onRetry={this.handleReset}
            onGoHome={this.handleGoHome}
          />
        );
      case "widget":
        return (
          <WidgetErrorFallback
            onRetry={this.handleReset}
            widgetName={this.props.name}
          />
        );
      case "app":
      default:
        return (
          <GlobalErrorFallback
            onRefresh={this.handleRefresh}
            onGoHome={this.handleGoHome}
          />
        );
    }
  }

  render() {
    if (this.state.hasError) {
      return this.renderDefaultFallback();
    }

    return this.props.children;
  }
}

export function AppErrorBoundary({
  children,
  name = "application",
  fallback,
}: {
  children: React.ReactNode;
  name?: string;
  fallback?: React.ReactNode;
}) {
  return (
    <ErrorBoundary level="app" name={name} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

export function PageErrorBoundary({
  children,
  name,
  routePath,
  fallback,
}: {
  children: React.ReactNode;
  name?: string;
  routePath?: string;
  fallback?: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      level="page"
      name={name}
      routePath={routePath}
      fallback={fallback}
    >
      {children}
    </ErrorBoundary>
  );
}

export function WidgetErrorBoundary({
  children,
  name,
  fallback,
}: {
  children: React.ReactNode;
  name?: string;
  fallback?: React.ReactNode;
}) {
  return (
    <ErrorBoundary level="widget" name={name} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
