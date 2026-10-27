/**
 * Standard type for form validation rules compatible with react-hook-form RegisterOptions.
 */
export type ValidationRule = {
  required?: string | boolean;
  pattern?: {
    value: RegExp;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  validate?: (value: any, formValues?: any) => boolean | string | Promise<boolean | string>;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
  disabled?: boolean;
};

export interface AlphabeticValidationOptions {
  required?: boolean;
  message?: string;
}

export interface RequiredValidationOptions {
  allowWhitespaceOnly?: boolean;
  message?: string;
}

export interface TrimmedAlphabeticOptions {
  required?: boolean;
  message?: string;
  maxLength?: number;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export type FileValidationOptions = {
  allowedExtensions: string[];
  maxSizeMB?: number;
  requiredMessage?: string;
  existingUrl?: string;
};

/* -------------------------------------------------------------------------- */
/* Common Regular Expression Patterns                                         */
/* -------------------------------------------------------------------------- */

export const strictEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const emailPattern = strictEmailPattern;
export const mobilePattern = /^[6-9]\d{9}$/;
export const fullMobilePattern = /^(?:\+91|91|0)?[-\s]?[6-9]\d{9}$/;
export const alphabeticPattern = /^[A-Za-z\s]+$/;
export const fullNamePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
export const digitsOnlyPattern = /^\d+$/;

/* -------------------------------------------------------------------------- */
/* Pure Validation & Sanitation Utilities                                    */
/* -------------------------------------------------------------------------- */

/**
 * Checks whether a value is a non-empty string consisting only of whitespace.
 */
export const isWhitespaceOnly = (value: unknown): boolean => {
  if (typeof value !== "string") return false;
  return value.length > 0 && value.trim().length === 0;
};

/**
 * Trims leading and trailing whitespace and collapses multiple consecutive
 * spaces between words to a single space. Preserves intentional spaces between words.
 */
export const sanitizeWhitespace = (value: unknown): string => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
};

/**
 * Traverses an object and trims all string values using `sanitizeWhitespace`.
 * Useful for normalizing form submissions before dispatching API requests.
 */
export const trimFormValues = <T extends Record<string, any>>(values: T): T => {
  if (!values || typeof values !== "object") return values;
  const result: any = Array.isArray(values) ? [] : {};
  for (const [key, val] of Object.entries(values)) {
    if (typeof val === "string") {
      result[key] = sanitizeWhitespace(val);
    } else if (
      val &&
      typeof val === "object" &&
      !(val instanceof File) &&
      !(val instanceof FileList) &&
      !(val instanceof Date)
    ) {
      result[key] = trimFormValues(val);
    } else {
      result[key] = val;
    }
  }
  return result;
};

/**
 * Standalone email validation check.
 */
export const isValidEmail = (value: string): boolean => {
  if (!value || typeof value !== "string") return false;
  return strictEmailPattern.test(value.trim());
};

/**
 * Standalone mobile number validation check (10 digits starting with 6-9).
 */
export const isValidMobile = (value: string): boolean => {
  if (!value || typeof value !== "string") return false;
  return mobilePattern.test(value.trim());
};

/**
 * Admin / standard password complexity validator.
 */
export const validatePassword = (
  password: string,
  isEdit = false
): string | true => {
  const trimmed = typeof password === "string" ? password.trim() : "";
  if (isEdit && !trimmed) return true;
  if (!trimmed) return "Password is required.";
  if (trimmed.length < 8) return "Password must be at least 8 characters long.";
  if (!/[a-z]/.test(trimmed))
    return "Password must contain at least one lowercase letter.";
  if (!/\d/.test(trimmed)) return "Password must contain at least one number.";
  return true;
};

/* -------------------------------------------------------------------------- */
/* Event Handlers & Input Helpers                                             */
/* -------------------------------------------------------------------------- */

/**
 * Creates an onBlur event handler that trims leading and trailing whitespace,
 * normalizes spaces between words, and keeps the field in sync with react-hook-form.
 */
export const createTrimOnBlurHandler = (
  fieldName: string,
  setValue?: (name: any, value: any, options?: any) => void,
  customOnBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
) => {
  return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const raw = e.target.value;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      if (trimmed.length > 0) {
        const cleaned = raw.trim().replace(/\s+/g, " ");
        if (cleaned !== raw && setValue) {
          setValue(fieldName, cleaned, { shouldValidate: true, shouldDirty: true });
        }
      } else if (raw.length > 0 && setValue) {
        // Field has spaces only; trigger validation so whitespace error is displayed
        setValue(fieldName, raw, { shouldValidate: true, shouldDirty: true });
      }
    }
    if (customOnBlur) {
      customOnBlur(e);
    }
  };
};

/* -------------------------------------------------------------------------- */
/* Centralized Form Validation Rules for react-hook-form                      */
/* -------------------------------------------------------------------------- */

export const validationRules = {
  /**
   * Required field rule. Rejects empty values and by default rejects whitespace-only values.
   */
  required: (field: string, options?: RequiredValidationOptions): ValidationRule => ({
    required: options?.message || `${field} is required`,
    validate: (value: unknown) => {
      if (!options?.allowWhitespaceOnly && typeof value === "string" && isWhitespaceOnly(value)) {
        return `${field} cannot contain only spaces`;
      }
      return true;
    },
  }),

  /**
   * Disallows whitespace-only values (useful for optional text fields).
   */
  noWhitespaceOnly: (field: string): ValidationRule => ({
    validate: (value: unknown) => {
      if (typeof value === "string" && isWhitespaceOnly(value)) {
        return `${field} cannot contain only spaces`;
      }
      return true;
    },
  }),

  /**
   * Alphabetic field rule (letters and spaces only).
   * - Optional by default (empty string is valid).
   * - Rejects whitespace-only input with `${field} cannot contain only spaces`.
   * - Rejects numbers / symbols with `${field} should contain only alphabets and spaces (no numbers or symbols)`.
   * - Preserves single spaces between words (e.g. "New Delhi").
   */
  alphabetic: (field: string, options?: AlphabeticValidationOptions): ValidationRule => {
    const isReq = options?.required ?? false;
    return {
      required: isReq ? `${field} is required` : false,
      validate: (value: unknown) => {
        if (value === undefined || value === null || value === "") {
          if (isReq) return `${field} is required`;
          return true;
        }

        const str = String(value);

        if (isWhitespaceOnly(str)) {
          return `${field} cannot contain only spaces`;
        }

        const trimmed = str.trim();
        if (isReq && trimmed.length === 0) {
          return `${field} is required`;
        }

        if (!alphabeticPattern.test(str)) {
          return `${field} should contain only alphabets and spaces (no numbers or symbols)`;
        }

        if (!/[A-Za-z]/.test(trimmed)) {
          return `${field} must contain at least one letter`;
        }

        return true;
      },
    };
  },

  /**
   * Combines alphabetic validation, input sanitization onChange, and whitespace trimming onBlur.
   * Simplifies form registration into a single line.
   */
  trimmedAlphabetic: (
    fieldLabel: string,
    fieldName: string,
    setValue?: (name: any, value: any, options?: any) => void,
    options?: TrimmedAlphabeticOptions
  ): ValidationRule => {
    const isReq = options?.required ?? false;
    const maxLen = options?.maxLength ?? 100;
    const rule = validationRules.alphabetic(fieldLabel, {
      required: isReq,
      message: options?.message,
    });

    return {
      ...rule,
      maxLength: {
        value: maxLen,
        message: `${fieldLabel} must be at most ${maxLen} characters`,
      },
      onChange: (e: any) => {
        if (setValue && e?.target) {
          const sanitized = e.target.value.replace(/[^A-Za-z\s]/g, "");
          setValue(fieldName, sanitized, { shouldValidate: true });
        }
        options?.onChange?.(e);
      },
      onBlur: createTrimOnBlurHandler(fieldName, setValue, options?.onBlur),
    };
  },

  /** Trims free-form text on blur while preserving punctuation and internal spacing. */
  trimmedText: (
    fieldLabel: string,
    fieldName: string,
    setValue?: (name: any, value: any, options?: any) => void,
    options?: { required?: boolean; onBlur?: (e: any) => void }
  ): ValidationRule => ({
    required: options?.required ? `${fieldLabel} is required` : false,
    validate: (value: unknown) => {
      if (value === undefined || value === null || value === "") {
        return options?.required ? `${fieldLabel} is required` : true;
      }
      return isWhitespaceOnly(value)
        ? `${fieldLabel} cannot contain only spaces`
        : true;
    },
    onBlur: createTrimOnBlurHandler(fieldName, setValue, options?.onBlur),
  }),

  /**
   * Full Name rule: requires min 2 letters with single spaces between words.
   */
  fullName: (field = "Full name"): ValidationRule => ({
    required: `${field} is required`,
    minLength: {
      value: 2,
      message: `${field} must be at least 2 characters long`,
    },
    pattern: {
      value: fullNamePattern,
      message: `${field} should contain only letters with single spaces between words`,
    },
    validate: (value: unknown) => {
      if (typeof value === "string" && isWhitespaceOnly(value)) {
        return `${field} cannot contain only spaces`;
      }
      return true;
    },
  }),

  /**
   * Email validation rule.
   */
  email: {
    pattern: {
      value: strictEmailPattern,
      message: "Enter a valid email address",
    },
    validate: (value: unknown) => {
      if (typeof value === "string" && isWhitespaceOnly(value)) {
        return "Email cannot contain only spaces";
      }
      return true;
    },
  } as ValidationRule,

  /**
   * Required Email validation rule.
   */
  requiredEmail: (field = "Email"): ValidationRule => ({
    required: `${field} is required`,
    pattern: {
      value: strictEmailPattern,
      message: "Enter a valid email address",
    },
    validate: (value: unknown) => {
      if (typeof value === "string" && isWhitespaceOnly(value)) {
        return `${field} cannot contain only spaces`;
      }
      return true;
    },
  }),

  /**
   * 10-digit Indian Mobile Number rule.
   */
  mobileNumber: {
    required: "Mobile Number is required",
    pattern: {
      value: mobilePattern,
      message: "Enter a valid 10-digit mobile number",
    },
    minLength: {
      value: 10,
      message: "Mobile number must be 10 digits",
    },
    maxLength: {
      value: 10,
      message: "Mobile number must be 10 digits",
    },
  } as ValidationRule,

  /**
   * Identifier rule: accepts either a valid email address OR a 10-digit mobile number.
   */
  identifier: (field = "Email ID or Contact Number"): ValidationRule => ({
    required: `${field} is required`,
    validate: (value: unknown) => {
      const str = String(value || "").trim();
      if (!str) return `${field} is required`;
      if (isWhitespaceOnly(value)) return `${field} cannot contain only spaces`;
      const isEmail = strictEmailPattern.test(str);
      const isPhone = mobilePattern.test(str);
      return isEmail || isPhone || "Enter a valid email or 10-digit mobile number";
    },
  }),

  /**
   * Age rule.
   */
  age: {
    pattern: {
      value: digitsOnlyPattern,
      message: "Age must be a number",
    },
    min: {
      value: 0,
      message: "Age cannot be negative",
    },
    max: {
      value: 150,
      message: "Enter a valid age",
    },
  } as ValidationRule,

  /** Optional experience value from 0 to 50 with up to one decimal place. */
  experienceYears: (field = "Experience"): ValidationRule => ({
    validate: (value: unknown) => {
      if (value === undefined || value === null || value === "") return true;
      const str = String(value);
      const parsed = Number(str);
      return (Number.isFinite(parsed) && parsed >= 0 && parsed <= 50 && /^\d{1,2}(?:\.\d)?$/.test(str))
        || `Enter ${field.toLowerCase()} between 0 and 50 years, with up to one decimal place`;
    },
  }),

  /**
   * Password rule. Rejects empty and whitespace-only passwords.
   */
  password: (options?: { minLength?: number; maxLength?: number; message?: string }): ValidationRule => {
    const minLen = options?.minLength ?? 6;
    const maxLen = options?.maxLength ?? 16;
    const requiredMsg = options?.message || "Password is required";
    return {
      required: requiredMsg,
      minLength: {
        value: minLen,
        message: `Password must be at least ${minLen} characters`,
      },
      maxLength: {
        value: maxLen,
        message: `Password must be at most ${maxLen} characters`,
      },
      validate: (value: unknown) => {
        if (!value) return requiredMsg;
        if (typeof value === "string" && isWhitespaceOnly(value)) {
          return "Password cannot contain only spaces";
        }
        return true;
      },
    };
  },

  /**
   * Confirm password rule matching a watched password. Rejects empty and whitespace-only values.
   */
  confirmPassword: (
    getPassword: () => string,
    message = "Passwords do not match",
    requiredMessage = "Confirm password is required"
  ): ValidationRule => ({
    required: requiredMessage,
    validate: (value: string) => {
      if (!value) return requiredMessage;
      if (typeof value === "string" && isWhitespaceOnly(value)) {
        return "Confirm password cannot contain only spaces";
      }
      return value === getPassword() || message;
    },
  }),

  /**
   * Max length rule.
   */
  maxLength: (field: string, length: number): ValidationRule => ({
    maxLength: {
      value: length,
      message: `${field} must be at most ${length} characters`,
    },
  }),

  /**
   * Min length rule.
   */
  minLength: (field: string, length: number): ValidationRule => ({
    minLength: {
      value: length,
      message: `${field} must be at least ${length} characters`,
    },
  }),

  /**
   * Required text field with trim-on-blur, whitespace rejection, and length constraints.
   * Use for fields like Address that need more than just `required`.
   */
  trimmedRequired: (
    fieldLabel: string,
    fieldName: string,
    setValue?: (name: any, value: any, options?: any) => void,
    options?: { minLength?: number; maxLength?: number; onBlur?: (e: any) => void }
  ): ValidationRule => {
    const minLen = options?.minLength ?? 2;
    const maxLen = options?.maxLength ?? 500;
    return {
      required: `${fieldLabel} is required`,
      minLength: {
        value: minLen,
        message: `${fieldLabel} must be at least ${minLen} characters`,
      },
      maxLength: {
        value: maxLen,
        message: `${fieldLabel} must be at most ${maxLen} characters`,
      },
      validate: (value: unknown) => {
        if (value === undefined || value === null || value === "") {
          return `${fieldLabel} is required`;
        }
        if (typeof value === "string" && isWhitespaceOnly(value)) {
          return `${fieldLabel} cannot contain only spaces`;
        }
        return true;
      },
      onBlur: createTrimOnBlurHandler(fieldName, setValue, options?.onBlur),
    };
  },

  /**
   * Security question answer: required, trimmed on blur, min 2, max 100 chars.
   */
  securityAnswer: (
    fieldLabel: string,
    fieldName: string,
    setValue?: (name: any, value: any, options?: any) => void,
    options?: { onBlur?: (e: any) => void }
  ): ValidationRule => ({
    required: `${fieldLabel} is required`,
    minLength: {
      value: 2,
      message: `${fieldLabel} must be at least 2 characters`,
    },
    maxLength: {
      value: 100,
      message: `${fieldLabel} must be at most 100 characters`,
    },
    validate: (value: unknown) => {
      if (value === undefined || value === null || value === "") {
        return `${fieldLabel} is required`;
      }
      if (typeof value === "string" && isWhitespaceOnly(value)) {
        return `${fieldLabel} cannot contain only spaces`;
      }
      return true;
    },
    onBlur: createTrimOnBlurHandler(fieldName, setValue, options?.onBlur),
  }),

  /**
   * Required email with trim-on-blur so leading/trailing spaces are auto-cleaned.
   */
  emailField: (
    fieldLabel: string,
    fieldName: string,
    setValue?: (name: any, value: any, options?: any) => void,
    options?: { onChange?: (e: any) => void; onBlur?: (e: any) => void }
  ): ValidationRule => ({
    required: `${fieldLabel} is required`,
    pattern: {
      value: strictEmailPattern,
      message: "Enter a valid email address",
    },
    validate: (value: unknown) => {
      if (typeof value === "string" && isWhitespaceOnly(value)) {
        return `${fieldLabel} cannot contain only spaces`;
      }
      return true;
    },
    onChange: options?.onChange,
    onBlur: createTrimOnBlurHandler(fieldName, setValue, options?.onBlur),
  }),

  /**
   * Optional remark/textarea: trim-on-blur, no whitespace-only, max 500 chars.
   */
  remarkField: (
    fieldLabel: string,
    fieldName: string,
    setValue?: (name: any, value: any, options?: any) => void,
    options?: { maxLength?: number; onBlur?: (e: any) => void }
  ): ValidationRule => {
    const maxLen = options?.maxLength ?? 500;
    return {
      maxLength: {
        value: maxLen,
        message: `${fieldLabel} must be at most ${maxLen} characters`,
      },
      validate: (value: unknown) => {
        if (typeof value === "string" && isWhitespaceOnly(value)) {
          return `${fieldLabel} cannot contain only spaces`;
        }
        return true;
      },
      onBlur: createTrimOnBlurHandler(fieldName, setValue, options?.onBlur),
    };
  },
};

/* -------------------------------------------------------------------------- */
/* File Upload Validation Utility                                             */
/* -------------------------------------------------------------------------- */

export const createFileValidation = ({
  allowedExtensions,
  maxSizeMB = 2,
  requiredMessage,
  existingUrl,
}: FileValidationOptions) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const lowerExts = allowedExtensions.map((e) => e.toLowerCase().replace(/^\./, ""));

  return {
    fileType: (fileInput: unknown) => {
      let file: File | undefined;
      if (!fileInput || (fileInput instanceof FileList && fileInput.length === 0)) {
        if (existingUrl) return true;
        return requiredMessage || true;
      }

      if (fileInput instanceof FileList) {
        file = fileInput[0];
      } else if (fileInput instanceof File) {
        file = fileInput;
      } else {
        if (existingUrl) return true;
        return requiredMessage || true;
      }

      const ext = file?.name?.split(".").pop()?.toLowerCase() || "";
      if (!lowerExts.includes(ext)) {
        return `File type not supported. Allowed: ${lowerExts.join(", ")}`;
      }
      return true;
    },

    fileSize: (fileInput: unknown) => {
      if (!fileInput) return true;
      let file: File | undefined;
      if (fileInput instanceof FileList) {
        if (fileInput.length === 0) return true;
        file = fileInput[0];
      } else if (fileInput instanceof File) {
        file = fileInput;
      } else {
        return true;
      }

      if (file && file.size > maxSizeBytes) {
        const currentMB = (file.size / 1024 / 1024).toFixed(2);
        return `File size must be under ${maxSizeMB}MB (current size: ${currentMB}MB)`;
      }
      return true;
    },
  };
};
