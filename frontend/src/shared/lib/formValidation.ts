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
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[6-9]\d{9}$/;

export const validationRules = {
  required: (field: string): ValidationRule => ({
    required: `${field} is required`,
  }),

  email: {
    pattern: {
      value: emailPattern,
      message: "Enter a valid email address",
    },
  },

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
  },

  age: {
    pattern: {
      value: /^\d+$/,
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
  },

  maxLength: (field: string, length: number): ValidationRule => ({
    maxLength: {
      value: length,
      message: `${field} must be at most ${length} characters`,
    },
  }),

  minLength: (field: string, length: number): ValidationRule => ({
    minLength: {
      value: length,
      message: `${field} must be at least ${length} characters`,
    },
  }),

  alphabetic: (field: string): ValidationRule => ({
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: `${field} should contain only alphabets and spaces (no numbers or symbols)`,
    },
  }),
};

export type FileValidationOptions = {
  allowedExtensions: string[];
  maxSizeMB?: number;
  requiredMessage?: string;
  existingUrl?: string;
};

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

