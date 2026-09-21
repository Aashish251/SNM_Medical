import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ErrorBoundary, WidgetErrorBoundary } from "./ErrorBoundary";
import { logBoundaryError } from "./errorLogger";

vi.mock("./errorLogger", () => ({
  logBoundaryError: vi.fn(),
}));

function BrokenComponent(): never {
  throw new Error("Boom");
}

describe("ErrorBoundary", () => {
  it("renders widget fallback and logs the error", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <WidgetErrorBoundary name="test-widget">
        <BrokenComponent />
      </WidgetErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("test-widget unavailable")).toBeTruthy();
    expect(logBoundaryError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("recovers when retry is clicked", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    let shouldThrow = true;

    function MaybeBroken() {
      if (shouldThrow) {
        throw new Error("Temporary failure");
      }
      return <div>Recovered content</div>;
    }

    render(
      <ErrorBoundary level="widget" name="recoverable-widget">
        <MaybeBroken />
      </ErrorBoundary>
    );

    expect(screen.getByText("recoverable-widget unavailable")).toBeTruthy();

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByText("Recovered content")).toBeTruthy();

    consoleError.mockRestore();
  });
});
