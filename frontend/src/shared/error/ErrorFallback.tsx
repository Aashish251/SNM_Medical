import { memo } from "react";
import { Button } from "@shared/components/ui/button";
import type { ErrorFallbackProps } from "./types";

export const ErrorFallback = memo(function ErrorFallback({
  title,
  description,
  actions,
  compact = false,
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={
        compact
          ? "rounded-xl border border-border bg-card p-6 text-center shadow-sm dark:border-border dark:bg-card"
          : "flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center sm:px-6"
      }
    >
      <h2
        className={
          compact
            ? "text-base font-semibold text-foreground"
            : "text-2xl font-semibold text-foreground"
        }
      >
        {title}
      </h2>
      <p
        className={
          compact
            ? "mx-auto mt-2 max-w-sm text-sm text-muted-foreground"
            : "mx-auto mt-3 max-w-md text-sm text-muted-foreground"
        }
      >
        {description}
      </p>
      <div
        className={
          compact
            ? "mt-4 flex flex-wrap items-center justify-center gap-2"
            : "mt-6 flex flex-wrap items-center justify-center gap-3"
        }
      >
        {actions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant={action.variant ?? "default"}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
});

export const GlobalErrorFallback = memo(function GlobalErrorFallback({
  onRefresh,
  onGoHome,
}: {
  onRefresh: () => void;
  onGoHome: () => void;
}) {
  return (
    <ErrorFallback
      title="Something went wrong"
      description="An unexpected error occurred. Please refresh the page or return to the home page. If the issue continues, contact support."
      actions={[
        { label: "Refresh", onClick: onRefresh },
        { label: "Go to Home", onClick: onGoHome, variant: "outline" },
      ]}
    />
  );
});

export const PageErrorFallback = memo(function PageErrorFallback({
  onRetry,
  onGoHome,
}: {
  onRetry: () => void;
  onGoHome: () => void;
}) {
  return (
    <ErrorFallback
      title="Page failed to load"
      description="This page encountered an error. You can retry or return to the home page while other areas of the application remain available."
      actions={[
        { label: "Retry", onClick: onRetry },
        { label: "Go to Home", onClick: onGoHome, variant: "outline" },
      ]}
    />
  );
});

export const WidgetErrorFallback = memo(function WidgetErrorFallback({
  onRetry,
  widgetName,
}: {
  onRetry: () => void;
  widgetName?: string;
}) {
  return (
    <ErrorFallback
      compact
      title={widgetName ? `${widgetName} unavailable` : "Widget unavailable"}
      description="This section failed to load. Try again later or continue using the rest of the page."
      actions={[{ label: "Try again", onClick: onRetry, variant: "outline" }]}
    />
  );
});
