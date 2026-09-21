export type ErrorBoundaryLevel = "app" | "page" | "widget";

export type ErrorLogPayload = {
  message: string;
  stack?: string;
  componentStack?: string | null;
  level: ErrorBoundaryLevel;
  boundaryName?: string;
  routePath: string;
  browser: {
    userAgent: string;
    language: string;
    url: string;
  };
  timestamp: string;
};

export type ErrorReporter = (payload: ErrorLogPayload) => void;

export type ErrorFallbackAction = {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
};

export type ErrorFallbackProps = {
  title: string;
  description: string;
  actions: ErrorFallbackAction[];
  compact?: boolean;
};
