import { describe, expect, it } from "vitest";
import { normalizeApiError } from "@shared/api/errors";

describe("useProfileWizardForm integration", () => {
  it("normalizeApiError provides safe city fetch failure messages", () => {
    const error = { status: 500, data: { message: "Cities unavailable" } };
    expect(normalizeApiError(error).message).toBe("Cities unavailable");
  });
});
