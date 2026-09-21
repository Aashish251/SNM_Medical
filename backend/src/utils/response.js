
/**
 * Send a standardized API response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g., 200, 400, 500)
 * @param {boolean} success - Whether the request succeeded
 * @param {string} message - Response message
 * @param {object} [data={}] - Optional response data
 */
exports.sendResponse = (res, statusCode = 200, success = true, message = '', data = {}) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && Object.keys(data).length > 0 && { data }),
  });
};

/**
 * Shorthand for success responses
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {object} [data={}] - Optional response data
 * @param {number} [statusCode=200] - HTTP status code
 */
exports.sendSuccess = (res, message = 'Success', data = {}, statusCode = 200) => {
  return exports.sendResponse(res, statusCode, true, message, data);
};

/**
 * Shorthand for error responses
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=500] - HTTP status code
 */
exports.sendError = (res, message = 'Internal server error', statusCode = 500) => {
  return exports.sendResponse(res, statusCode, false, message);
};
