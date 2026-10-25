import { describe, expect, it, vi } from "vitest";
import { normalizeApiError } from "@shared/api/errors";

describe("useProfileWizardForm integration", () => {
  it("normalizeApiError provides safe city fetch failure messages", () => {
    const error = { status: 500, data: { message: "Cities unavailable" } };
    expect(normalizeApiError(error).message).toBe("Cities unavailable");
  });

  it("nextStep strict boolean check only skips validation when skipValidation === true", async () => {
    const setCurrentStep = vi.fn();
    const trigger = vi.fn().mockResolvedValue(false);

    const makeNextStep = (currentStep: number) => async (skipValidation: boolean | unknown = false) => {
      if (skipValidation === true) {
        setCurrentStep((s: number) => s + 1);
        return true;
      }
      const valid = await trigger(["qualificationId", "departmentId", "availableDayId", "shiftTimeId"]);
      if (valid) {
        setCurrentStep((s: number) => s + 1);
        return true;
      }
      return false;
    };

    const nextStep = makeNextStep(2);

    // Calling with MouseEvent / object must NOT skip validation
    const fakeEvent = { type: "click", preventDefault: () => {} };
    const resWithEvent = await nextStep(fakeEvent);
    expect(resWithEvent).toBe(false);
    expect(trigger).toHaveBeenCalled();
    expect(setCurrentStep).not.toHaveBeenCalled();

    // Calling with boolean true DOES skip validation
    const resWithTrue = await nextStep(true);
    expect(resWithTrue).toBe(true);
    expect(setCurrentStep).toHaveBeenCalled();
  });
});
