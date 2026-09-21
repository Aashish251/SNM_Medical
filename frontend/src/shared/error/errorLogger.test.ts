import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  logBoundaryError,
  resetErrorReporter,
  setErrorReporter,
  createMonitoringAdapter,
} from "./errorLogger";

describe("errorLogger", () => {
  beforeEach(() => {
    resetErrorReporter();
  });

  afterEach(() => {
    resetErrorReporter();
  });

  it("captures structured boundary error payloads", () => {
    const reporter = vi.fn();
    setErrorReporter(reporter);

    const error = new Error("Render failed");
    logBoundaryError(error, {
      level: "page",
      boundaryName: "admin-dashboard",
      componentStack: "\n    in Dashboard",
      routePath: "/admin/dashboard",
    });

    expect(reporter).toHaveBeenCalledTimes(1);
    const payload = reporter.mock.calls[0][0];

    expect(payload.message).toBe("Render failed");
    expect(payload.level).toBe("page");
    expect(payload.boundaryName).toBe("admin-dashboard");
    expect(payload.routePath).toBe("/admin/dashboard");
    expect(payload.componentStack).toContain("Dashboard");
    expect(payload.timestamp).toBeTruthy();
    expect(payload.browser.userAgent).toBeTruthy();
  });

  it("supports monitoring adapter injection", () => {
    const captureException = vi.fn();
    setErrorReporter(createMonitoringAdapter({ captureException }));

    logBoundaryError(new Error("Widget crash"), {
      level: "widget",
      boundaryName: "department-bar-chart",
    });

    expect(captureException).toHaveBeenCalledTimes(1);
    expect(captureException.mock.calls[0][1]?.extra?.level).toBe("widget");
  });
});
