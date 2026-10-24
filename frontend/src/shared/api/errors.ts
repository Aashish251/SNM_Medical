import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type ApiError = {
  status?: number | string;
  message: string;
  details?: unknown;
};

type ErrorPayload = {
  message?: string;
  error?: unknown;
  stack?: string;
  data?: ErrorPayload;
};

function readableMessage(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const firstLine = value.split("\n").map((line) => line.trim()).find(Boolean);
  return firstLine?.replace(/^Error:\s*/, "").replace(/^\w+Error:\s*/, "");
}

export function normalizeApiError(error: unknown): ApiError {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as ErrorPayload | undefined;
    const nestedData = data?.data;

    return {
      status: error.status,
      message:
        readableMessage(data?.message) ||
        readableMessage(data?.error) ||
        readableMessage(data?.stack) ||
        readableMessage(nestedData?.message) ||
        readableMessage(nestedData?.error) ||
        (error.status === "FETCH_ERROR"
          ? "Network error. Please check your connection."
          : "Something went wrong. Please try again."),
      details: error.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      details: error,
    };
  }

  if (typeof error === "object" && error !== null) {
    const payload = error as ErrorPayload;
    const message = readableMessage(payload.message) || readableMessage(payload.error) || readableMessage(payload.stack);
    if (message) return { message, details: error };
  }

  return {
    message: "Something went wrong. Please try again.",
    details: error,
  };
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}
