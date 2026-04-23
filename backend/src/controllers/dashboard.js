const dashboardService = require('../services/dashboard');
const { sendResponse } = require('../utils/response');
const logger = require('../utils/logger');

exports.getStats = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats(req.user.userId);
    sendResponse(res, 200, true, 'Dashboard statistics fetched successfully', data);
  } catch (error) {
    logger.error('Dashboard stats fetch failed', { userId: req.user?.userId, error: error.message });
    sendResponse(res, 500, false, error.message);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await dashboardService.getUserProfile(req.user.userId);
    sendResponse(res, 200, true, 'Profile fetched successfully', profile);
  } catch (error) {
    logger.error('Profile fetch failed', { userId: req.user?.userId, error: error.message });
    sendResponse(res, error.message.includes('not found') ? 404 : 500, false, error.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await dashboardService.updateUserProfile(req.user.userId, req.body);
    sendResponse(res, 200, true, 'Profile updated successfully');
  } catch (error) {
    logger.error('Profile update failed', { userId: req.user?.userId, error: error.message });
    const status = /taken|not found/i.test(error.message) ? 409 : 500;
    sendResponse(res, status, false, error.message);
  }
};

// exports.updatePresence = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { isPresent, passEntry } = req.body;
//     await dashboardService.updateUserPresence(userId, isPresent, passEntry);
//     sendResponse(res, 200, true, 'User presence updated successfully');
//   } catch (error) {
//     const status = /not found/i.test(error.message) ? 404 : 500;
//     sendResponse(res, status, false, error.message);
//   }
// };

exports.getAdminSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getAdminSummary();
    sendResponse(res, 200, true, 'Admin summary fetched successfully', summary);
  } catch (error) {
    logger.error('Admin summary fetch failed', { error: error.message });
    sendResponse(res, 500, false, error.message);
  }
};
