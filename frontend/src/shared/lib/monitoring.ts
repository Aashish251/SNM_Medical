type MonitoringContext = Record<string, unknown>;

export function reportError(error: unknown, context: MonitoringContext = {}) {
  if (import.meta.env.DEV) {
    console.error("Application error", error, context);
  }
}

export function reportMetric(name: string, value: number, context: MonitoringContext = {}) {
  if (import.meta.env.DEV) {
    console.info("Application metric", { name, value, ...context });
  }
}
