/**
 * Single source of truth for text normalization and validation rules.
 * sanitize.js and registration.js import normalizers from this module.
 */

/* -------------------------------------------------------------------------- */
/* Normalizers                                                                */
/* -------------------------------------------------------------------------- */

const normalizeText = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
};

const normalizePhone = (value) => {
  if (typeof value !== 'string') return '';
  let phone = value.trim().replace(/[\s\-]/g, '');
  phone = phone.replace(/^(\+91|91|0)/, '');
  return phone;
};

const normalizeEmail = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

/* -------------------------------------------------------------------------- */
/* Shared Patterns                                                            */
/* -------------------------------------------------------------------------- */

const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[6-9]\d{9}$/,
  fullName: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
  experience: /^\d{1,2}(?:\.\d)?$/,
  alphanumericText: /^[A-Za-z\s'.,!?\-]+$/,
};

/* -------------------------------------------------------------------------- */
/* Validators                                                                 */
/* -------------------------------------------------------------------------- */

const validators = {
  email: (email) => {
    const normalized = normalizeEmail(email);
    return PATTERNS.email.test(normalized);
  },

  mobile: (mobile) => {
    const normalized = normalizePhone(mobile);
    return PATTERNS.mobile.test(normalized);
  },

  password: (password) =>
    Boolean(password && String(password).trim().length >= 6 && String(password).trim().length <= 16),

  name: (name) => {
    const normalized = normalizeText(name);
    return PATTERNS.fullName.test(normalized) && normalized.length >= 2 && normalized.length <= 50;
  },

  experience: (value) => {
    const text = String(value ?? '');
    return PATTERNS.experience.test(text) && Number(text) >= 0 && Number(text) <= 60;
  },

  /** Required security question answer: 2-100 chars, not whitespace-only. */
  securityAnswer: (value) => {
    const normalized = normalizeText(value);
    return normalized.length >= 2 && normalized.length <= 100;
  },

  /** Optional text with punctuation: max 100 chars. */
  alphanumericWithSpaces: (value, min = 2, max = 100) => {
    const normalized = normalizeText(value);
    if (!normalized) return false;
    return normalized.length >= min && normalized.length <= max && PATTERNS.alphanumericText.test(normalized);
  },

  /** Required text: 2-100 chars, not empty. */
  requiredText: (value, min = 2, max = 100) => {
    const normalized = normalizeText(value);
    if (!normalized) return false;
    return normalized.length >= min && normalized.length <= max;
  },

  /** Address: min 5, max 500, must contain at least one letter. */
  address: (value) => {
    const normalized = normalizeText(value);
    if (!normalized) return false;
    return normalized.length >= 5 && normalized.length <= 500 && /[A-Za-z]/.test(normalized);
  },

  /** Optional remark: max 500, not whitespace-only. */
  remark: (value) => {
    if (!value || typeof value !== 'string') return true;
    const normalized = normalizeText(value);
    if (normalized.length === 0 && value.trim().length > 0) return false; // whitespace-only
    return normalized.length <= 500;
  },
};

/* -------------------------------------------------------------------------- */
/* Exports                                                                    */
/* -------------------------------------------------------------------------- */

exports.normalizeText = normalizeText;
exports.normalizePhone = normalizePhone;
exports.normalizeEmail = normalizeEmail;
exports.PATTERNS = PATTERNS;
exports.validators = validators;

module.exports = exports;