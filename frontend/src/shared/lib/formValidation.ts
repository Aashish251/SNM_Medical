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
};
