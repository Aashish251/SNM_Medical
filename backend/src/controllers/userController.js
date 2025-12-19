const userService = require('../services/userService');
const { sendResponse } = require('../utils/response');

exports.addUserRole = async (req, res) => {
  try {
    const {
      regId,
      isPresent,
      passEntry,
      isDeleted,
      isAdmin,
      remark,
      sewaLocation,
      samagamHeldIn
    } = req.body;

    if (!regId) {
      return sendResponse(res, 400, false, 'Registration ID is required.');
    }

    // Convert regId to string if it's an array
    const regIdString = Array.isArray(regId) ? regId.join(',') : regId.toString();

    const data = await userService.addUserRole({
      regId: regIdString,
      isPresent,
      passEntry,
      isDeleted,
      isAdmin,
      remark,
      sewaLocation,
      samagamHeldIn
    });

    sendResponse(res, 200, true, data.message, data);
  } catch (error) {
    console.error('❌ approve Controller Error:', error);
    sendResponse(res, 500, false, 'Failed to update user role');
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { regId } = req.params;

    const user = await userService.getUserProfile(regId);

    // Return a consistent response shape
    return res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error("❌ Controller User Profile Error:", error);
    // If the service throws a 'not found' error, return 404
    if (error && error.message && error.message.toLowerCase().includes('not found')) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

