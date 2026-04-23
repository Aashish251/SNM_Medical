/**
 * Input sanitization utilities
 * Protects against XSS and injection attacks
 */

/**
 * Sanitize user input by removing dangerous characters
 * @param {*} input - The input to sanitize
 * @returns {*} Sanitized input
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>'"\\\/]/g, '')  // Strip XSS-prone characters
    .replace(/\0/g, '')          // Strip null bytes
    .replace(/javascript:/gi, '') // Strip javascript: URIs
    .replace(/on\w+\s*=/gi, ''); // Strip inline event handlers
};

/**
 * Sanitize an object's string values recursively
 * @param {object} obj - Object with values to sanitize
 * @returns {object} Object with sanitized string values
 */
exports.sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = exports.sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = exports.sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
