// src/controllers/auth.controller.js
const authService = require('../services/auth');
const { sendResponse } = require('../utils/response');

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    sendResponse(res, 200, true, 'Login successful', result);
  } catch (error) {
    // Determine status code based on error type/message
    let status = 500;
    
    if (/invalid request/i.test(error.message)) {
      status = 400; // Bad Request - missing required fields
    } else if (
      /permission/i.test(error.message) || 
      /invalid/i.test(error.message) ||
      /not authorized/i.test(error.message) ||
      /deactivated/i.test(error.message) ||
      /not approved/i.test(error.message)
    ) {
      status = 401; // Unauthorized - auth failed
    }
    
    // Log the error for debugging
    console.error('Login error:', {
      message: error.message,
      status,
      timestamp: new Date().toISOString()
    });
    
    sendResponse(res, status, false, error.message || 'An error occurred during login');
  }
};


/**
 * Step 1: Forgot password validation
 */
exports.validateForgotPassword = async (req, res) => {
  try {
    const result = await authService.validateForgotPassword(req.body);
    sendResponse(res, 200, result.success, result.message, result.data);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

/**
 * Step 2: Reset Password
 */
exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    sendResponse(res, 200, result.success, result.message, result.data || null);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

