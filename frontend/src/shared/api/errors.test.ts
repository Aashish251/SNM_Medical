import { describe, expect, it } from "vitest";
import { normalizeApiError } from "@shared/api/errors";

describe("normalizeApiError", () => {
  it("extracts message from RTK Query error payload", () => {
    const error = {
      status: 400,
      data: { message: "Invalid credentials" },
    };

    const result = normalizeApiError(error);

    expect(result.status).toBe(400);
    expect(result.message).toBe("Invalid credentials");
  });

  it("returns network message for fetch errors", () => {
    const error = { status: "FETCH_ERROR", error: "Failed to fetch" };

    const result = normalizeApiError(error);

    expect(result.message).toBe(
      "Network error. Please check your connection."
    );
  });

  it("handles native Error instances", () => {
    const result = normalizeApiError(new Error("Unexpected failure"));

    expect(result.message).toBe("Unexpected failure");
  });

  it("falls back to a safe default message", () => {
    const result = normalizeApiError("unknown");

    expect(result.message).toBe("Something went wrong. Please try again.");
  });
});
