import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export type ApiError = {
  status?: number | string;
  message: string;
  details?: unknown;
};

type ErrorPayload = {
  message?: string;
  error?: string;
};

export function normalizeApiError(error: unknown): ApiError {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as ErrorPayload | undefined;

    return {
      status: error.status,
      message:
        data?.message ||
        data?.error ||
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

  return {
    message: "Something went wrong. Please try again.",
    details: error,
  };
}

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === "object" && error !== null && "status" in error;
}
