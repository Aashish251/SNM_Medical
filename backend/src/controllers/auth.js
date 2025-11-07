// src/controllers/auth.controller.js
const authService = require('../services/auth');
const { sendResponse } = require('../utils/response');

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    sendResponse(res, 200, true, 'Login successful', result);
  } catch (error) {
    const status =
      /permission/i.test(error.message) || /invalid/i.test(error.message)
        ? 401
        : 500;
    sendResponse(res, status, false, error.message);
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const identifier = email || mobile;
    const message = await authService.forgotPassword(identifier);
    sendResponse(res, 200, true, message);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

exports.verifyForgotPassword = async (req, res) => {
  try {
    const result = await authService.verifyForgotPassword(req.body);
    sendResponse(res, 200, result.success, result.message, result.data);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};
