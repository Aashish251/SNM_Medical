/**
 * Consolidated Admin Form Validation Utilities.
 * Re-exports the centralized validation utilities from @shared/lib/formValidation
 * to ensure a single source of truth across the entire project.
 */
export {
  emailPattern,
  isValidEmail,
  validatePassword,
  validationRules,
  isWhitespaceOnly,
  sanitizeWhitespace,
  trimFormValues,
} from "@shared/lib/formValidation";
export type { ValidationRule } from "@shared/lib/formValidation";
