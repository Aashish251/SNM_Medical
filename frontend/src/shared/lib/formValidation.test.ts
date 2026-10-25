import { describe, expect, it, vi } from "vitest";
import {
  isWhitespaceOnly,
  sanitizeWhitespace,
  trimFormValues,
  isValidEmail,
  isValidMobile,
  validatePassword,
  validationRules,
  createTrimOnBlurHandler,
} from "./formValidation";

describe("formValidation utilities", () => {
  describe("isWhitespaceOnly", () => {
    it("returns true for strings containing only spaces or whitespace", () => {
      expect(isWhitespaceOnly(" ")).toBe(true);
      expect(isWhitespaceOnly("   ")).toBe(true);
      expect(isWhitespaceOnly("\t\n  ")).toBe(true);
    });

    it("returns false for non-empty strings with characters", () => {
      expect(isWhitespaceOnly("a")).toBe(false);
      expect(isWhitespaceOnly("  a  ")).toBe(false);
      expect(isWhitespaceOnly("hello world")).toBe(false);
    });

    it("returns false for empty string or non-string values", () => {
      expect(isWhitespaceOnly("")).toBe(false);
      expect(isWhitespaceOnly(null)).toBe(false);
      expect(isWhitespaceOnly(undefined)).toBe(false);
      expect(isWhitespaceOnly(123)).toBe(false);
    });
  });

  describe("sanitizeWhitespace", () => {
    it("trims leading/trailing spaces and collapses internal consecutive spaces", () => {
      expect(sanitizeWhitespace("   hello    world   ")).toBe("hello world");
      expect(sanitizeWhitespace("   delhi   samagam   2024  ")).toBe("delhi samagam 2024");
      expect(sanitizeWhitespace("word")).toBe("word");
      expect(sanitizeWhitespace("   ")).toBe("");
    });

    it("handles non-string inputs safely", () => {
      expect(sanitizeWhitespace(null)).toBe("");
      expect(sanitizeWhitespace(undefined)).toBe("");
      expect(sanitizeWhitespace(123 as any)).toBe("");
    });
  });

  describe("trimFormValues", () => {
    it("trims all string properties in a form values object", () => {
      const input = {
        samagamHeldIn: "   Delhi Samagam   ",
        lastSewa: "   Medical Dispensary   ",
        recommendedBy: "   Dr. Sharma   ",
        favoriteFood: "   Biryani   ",
        childhoodNickname: "   Sonu   ",
        motherMaidenName: "   Kaur   ",
        hobbies: "   Reading   Music   ",
        age: 25,
        isActive: true,
      };

      const result = trimFormValues(input);

      expect(result.samagamHeldIn).toBe("Delhi Samagam");
      expect(result.lastSewa).toBe("Medical Dispensary");
      expect(result.recommendedBy).toBe("Dr. Sharma");
      expect(result.favoriteFood).toBe("Biryani");
      expect(result.childhoodNickname).toBe("Sonu");
      expect(result.motherMaidenName).toBe("Kaur");
      expect(result.hobbies).toBe("Reading Music");
      expect(result.age).toBe(25);
      expect(result.isActive).toBe(true);
    });

    it("handles nested objects without mutating non-string types", () => {
      const input = {
        user: {
          name: "  John Doe  ",
          details: {
            nickname: "  Johnny  ",
          },
        },
      };

      const result = trimFormValues(input);
      expect(result.user.name).toBe("John Doe");
      expect(result.user.details.nickname).toBe("Johnny");
    });
  });

  describe("isValidEmail & isValidMobile", () => {
    it("validates email correctly", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("  user.name@domain.co.in  ")).toBe(true);
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });

    it("validates 10-digit Indian mobile number correctly", () => {
      expect(isValidMobile("9876543210")).toBe(true);
      expect(isValidMobile("8123456789")).toBe(true);
      expect(isValidMobile("5123456789")).toBe(false); // starts with 5
      expect(isValidMobile("987654321")).toBe(false); // 9 digits
      expect(isValidMobile("98765432100")).toBe(false); // 11 digits
      expect(isValidMobile("")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("enforces password rules for new users", () => {
      expect(validatePassword("")).toBe("Password is required.");
      expect(validatePassword("short")).toBe("Password must be at least 8 characters long.");
      expect(validatePassword("ALLCAPS123")).toBe("Password must contain at least one lowercase letter.");
      expect(validatePassword("lowercaseonly")).toBe("Password must contain at least one number.");
      expect(validatePassword("validPass1")).toBe(true);
    });

    it("allows empty password when isEdit is true", () => {
      expect(validatePassword("", true)).toBe(true);
      expect(validatePassword("   ", true)).toBe(true);
    });
  });

  describe("validationRules.required", () => {
    const rule = validationRules.required("Full Name");

    it("provides required message", () => {
      expect(rule.required).toBe("Full Name is required");
    });

    it("rejects whitespace-only values by default", () => {
      const validate = rule.validate as any;
      if (typeof validate === "function") {
        expect(validate("   ")).toBe("Full Name cannot contain only spaces");
        expect(validate("\t  \n")).toBe("Full Name cannot contain only spaces");
        expect(validate("John Doe")).toBe(true);
      }
    });

    it("respects allowWhitespaceOnly option if explicitly set", () => {
      const permissiveRule = validationRules.required("Notes", { allowWhitespaceOnly: true });
      const validate = permissiveRule.validate as any;
      if (typeof validate === "function") {
        expect(validate("   ")).toBe(true);
      } else {
        expect(validate).toBeUndefined();
      }
    });
  });

  describe("validationRules.alphabetic - 7 Target Fields", () => {
    describe("Optional fields (Samagam Held In, Sewa Performed, Recommended By)", () => {
      const samagamRule = validationRules.alphabetic("Samagam Held In");
      const validate = samagamRule.validate as (val: unknown) => string | boolean;

      it("accepts empty or null values when optional", () => {
        expect(validate("")).toBe(true);
        expect(validate(null)).toBe(true);
        expect(validate(undefined)).toBe(true);
      });

      it("rejects whitespace-only values with appropriate error message", () => {
        expect(validate(" ")).toBe("Samagam Held In cannot contain only spaces");
        expect(validate("   ")).toBe("Samagam Held In cannot contain only spaces");
        expect(validate("\t  ")).toBe("Samagam Held In cannot contain only spaces");
      });

      it("accepts valid alphabetic strings with spaces between words", () => {
        expect(validate("Delhi Samagam")).toBe(true);
        expect(validate("Samagam Ground")).toBe(true);
      });

      it("accepts values with leading/trailing spaces as long as they contain alphabets (to be trimmed on blur/submit)", () => {
        expect(validate("  Delhi Samagam  ")).toBe(true);
      });

      it("rejects numbers and symbols", () => {
        expect(validate("Samagam 2024")).toBe(
          "Samagam Held In should contain only alphabets and spaces (no numbers or symbols)"
        );
        expect(validate("Delhi @ Samagam")).toBe(
          "Samagam Held In should contain only alphabets and spaces (no numbers or symbols)"
        );
      });
    });

    describe("Required security questions (Favorite Food, Childhood Nickname, Mother's Maiden Name, Hobbies)", () => {
      const foodRule = validationRules.alphabetic("Favorite food", { required: true });
      const validate = foodRule.validate as (val: unknown) => string | boolean;

      it("requires a value when empty", () => {
        expect(foodRule.required).toBe("Favorite food is required");
        expect(validate("")).toBe("Favorite food is required");
        expect(validate(null)).toBe("Favorite food is required");
        expect(validate(undefined)).toBe("Favorite food is required");
      });

      it("rejects whitespace-only values with appropriate error message", () => {
        expect(validate(" ")).toBe("Favorite food cannot contain only spaces");
        expect(validate("    ")).toBe("Favorite food cannot contain only spaces");
        expect(validate("\t\n ")).toBe("Favorite food cannot contain only spaces");
      });

      it("accepts valid multi-word answers with single spaces", () => {
        expect(validate("Biryani")).toBe(true);
        expect(validate("Mac and Cheese")).toBe(true);
        expect(validate("South Indian Dosa")).toBe(true);
      });

      it("rejects numbers and symbols in security questions", () => {
        expect(validate("Biryani 123")).toBe(
          "Favorite food should contain only alphabets and spaces (no numbers or symbols)"
        );
        expect(validate("Food#1")).toBe(
          "Favorite food should contain only alphabets and spaces (no numbers or symbols)"
        );
      });
    });
  });

  describe("validationRules.identifier", () => {
    const rule = validationRules.identifier("Email or Mobile");
    const validate = rule.validate as (val: unknown) => string | boolean;

    it("accepts valid email", () => {
      expect(validate("user@example.com")).toBe(true);
    });

    it("accepts valid 10-digit mobile number", () => {
      expect(validate("9876543210")).toBe(true);
    });

    it("rejects invalid identifier", () => {
      expect(validate("invalid-input")).toBe("Enter a valid email or 10-digit mobile number");
    });

    it("rejects whitespace-only identifier", () => {
      expect(validate("   ")).toBe("Email or Mobile is required");
    });

    it("rejects empty identifier", () => {
      expect(validate("")).toBe("Email or Mobile is required");
    });
  });

  describe("createTrimOnBlurHandler", () => {
    it("trims leading and trailing whitespace and preserves meaningful spaces between words", () => {
      const setValueMock = vi.fn();
      const onBlur = createTrimOnBlurHandler("favoriteFood", setValueMock);

      const event = {
        target: { value: "   Pav   Bhaji   " },
      } as React.FocusEvent<HTMLInputElement>;

      onBlur(event);

      expect(setValueMock).toHaveBeenCalledWith(
        "favoriteFood",
        "Pav Bhaji",
        { shouldValidate: true, shouldDirty: true }
      );
    });

    it("triggers validation when field contains only spaces", () => {
      const setValueMock = vi.fn();
      const onBlur = createTrimOnBlurHandler("samagamHeldIn", setValueMock);

      const event = {
        target: { value: "   " },
      } as React.FocusEvent<HTMLInputElement>;

      onBlur(event);

      expect(setValueMock).toHaveBeenCalledWith(
        "samagamHeldIn",
        "   ",
        { shouldValidate: true, shouldDirty: true }
      );
    });

    it("does not call setValue if value was already cleanly formatted", () => {
      const setValueMock = vi.fn();
      const onBlur = createTrimOnBlurHandler("fullName", setValueMock);

      const event = {
        target: { value: "John Doe" },
      } as React.FocusEvent<HTMLInputElement>;

      onBlur(event);

      expect(setValueMock).not.toHaveBeenCalled();
    });

    it("calls custom onBlur callback if provided", () => {
      const customOnBlur = vi.fn();
      const onBlur = createTrimOnBlurHandler("hobbies", undefined, customOnBlur);

      const event = {
        target: { value: "Reading" },
      } as React.FocusEvent<HTMLInputElement>;

      onBlur(event);

      expect(customOnBlur).toHaveBeenCalledWith(event);
    });
  });

  describe("validationRules.password", () => {
    const rule = validationRules.password({ minLength: 6 });
    const validate = rule.validate as any;

    it("has required error message", () => {
      expect(rule.required).toBe("Password is required");
    });

    it("rejects empty password in validate", () => {
      expect(validate("")).toBe("Password is required");
    });

    it("rejects whitespace-only password", () => {
      expect(validate("      ")).toBe("Password cannot contain only spaces");
      expect(validate("\t  \n")).toBe("Password cannot contain only spaces");
    });

    it("accepts valid password", () => {
      expect(validate("ValidPassword123")).toBe(true);
    });
  });

  describe("validationRules.confirmPassword", () => {
    const rule = validationRules.confirmPassword(() => "CorrectPassword123");
    const validate = rule.validate as any;

    it("has required error message", () => {
      expect(rule.required).toBe("Confirm password is required");
    });

    it("rejects empty confirm password", () => {
      expect(validate("")).toBe("Confirm password is required");
    });

    it("rejects whitespace-only confirm password", () => {
      expect(validate("   ")).toBe("Confirm password cannot contain only spaces");
    });

    it("rejects mismatched password", () => {
      expect(validate("DifferentPassword")).toBe("Passwords do not match");
    });

    it("accepts matching password", () => {
      expect(validate("CorrectPassword123")).toBe(true);
    });
  });

  describe("validationRules.requiredEmail", () => {
    const rule = validationRules.requiredEmail("Email");
    const validate = rule.validate as any;

    it("has required error message", () => {
      expect(rule.required).toBe("Email is required");
    });

    it("rejects whitespace-only email", () => {
      expect(validate("   ")).toBe("Email cannot contain only spaces");
    });

    it("accepts valid email in validate", () => {
      expect(validate("user@example.com")).toBe(true);
    });
  });

  describe("validationRules.noWhitespaceOnly", () => {
    const rule = validationRules.noWhitespaceOnly("Notes");
    const validate = rule.validate as any;

    it("accepts empty, null, or undefined values for optional fields", () => {
      expect(validate("")).toBe(true);
      expect(validate(null)).toBe(true);
      expect(validate(undefined)).toBe(true);
    });

    it("rejects whitespace-only input", () => {
      expect(validate("   ")).toBe("Notes cannot contain only spaces");
    });

    it("accepts text with meaningful content", () => {
      expect(validate("Some valid note")).toBe(true);
    });
  });
});
