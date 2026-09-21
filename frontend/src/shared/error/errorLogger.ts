import { reportError } from "@shared/lib/monitoring";
import type { ErrorBoundaryLevel, ErrorLogPayload, ErrorReporter } from "./types";

function getRoutePath(): string {
  if (typeof window === "undefined") {
    return "unknown";
  }

  return `${window.location.pathname}${window.location.search}`;
}

function getBrowserContext() {
  if (typeof window === "undefined") {
    return {
      userAgent: "unknown",
      language: "unknown",
      url: "unknown",
    };
  }

  return {
    userAgent: window.navigator.userAgent,
    language: window.navigator.language,
    url: window.location.href,
  };
}

function defaultReporter(payload: ErrorLogPayload) {
  reportError(payload.message, {
    ...payload,
    source: "error-boundary",
  });
}

let reporter: ErrorReporter = defaultReporter;

export function setErrorReporter(nextReporter: ErrorReporter) {
  reporter = nextReporter;
}

export function resetErrorReporter() {
  reporter = defaultReporter;
}

export function logBoundaryError(
  error: Error,
  options: {
    level: ErrorBoundaryLevel;
    boundaryName?: string;
    componentStack?: string | null;
    routePath?: string;
  }
) {
  const payload: ErrorLogPayload = {
    message: error.message,
    stack: error.stack,
    componentStack: options.componentStack ?? null,
    level: options.level,
    boundaryName: options.boundaryName,
    routePath: options.routePath ?? getRoutePath(),
    browser: getBrowserContext(),
    timestamp: new Date().toISOString(),
  };

  reporter(payload);
  return payload;
}

export function createMonitoringAdapter(
  service: {
    captureException: (
      error: Error,
      context?: Record<string, unknown>
    ) => void;
  }
): ErrorReporter {
  return (payload) => {
    const error = new Error(payload.message);
    if (payload.stack) {
      error.stack = payload.stack;
    }

    service.captureException(error, {
      tags: {
        level: payload.level,
        boundaryName: payload.boundaryName,
      },
      extra: payload,
    });
  };
}
