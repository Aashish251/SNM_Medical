const userService = require('../services/userService');
const searchService = require('../services/searchService');
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
      samagamHeldIn,
      onDuty
    } = req.body;

    if (!regId) {
      return sendResponse(res, 400, false, 'Registration ID is required.');
    }

    // Split regId by comma to handle multiple user IDs
    const regIds = regId.toString().split(',').map(id => id.trim()).filter(id => id);

    if (regIds.length === 0) {
      return sendResponse(res, 400, false, 'No valid Registration IDs provided.');
    }

    // For multiple users, use updateSelectedUsers which properly handles null values
    if (regIds.length > 1) {
      const userUpdates = regIds.map(id => ({
        reg_id: parseInt(id, 10),
        is_present: isPresent !== null && isPresent !== undefined ? isPresent : undefined,
        pass_entry: passEntry !== null && passEntry !== undefined ? passEntry : undefined,
        is_deleted: isDeleted !== null && isDeleted !== undefined ? isDeleted : undefined,
        is_admin: isAdmin !== null && isAdmin !== undefined ? isAdmin : undefined,
        remark: remark || undefined,
        sewa_location_id: sewaLocation || undefined,
        samagam_held_in: samagamHeldIn || undefined,
        onduty: onDuty || undefined
      }));

      await searchService.updateSelectedUsers(userUpdates);
      return sendResponse(res, 200, true, `User roles updated successfully for ${regIds.length} record(s)`);
    }

    // For single user, use the original stored procedure
    const data = await userService.addUserRole({
      regId: regIds[0],
      isPresent,
      passEntry,
      isDeleted,
      isAdmin,
      remark,
      sewaLocation,
      samagamHeldIn,
      onduty: onDuty
    });

    sendResponse(res, 200, true, data.message, data);
  } catch (error) {
    console.error(' approve Controller Error:', error);
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
    console.error(" Controller User Profile Error:", error);
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

exports.updateUserProfile = async (req, res) => {
  try {
    const { regId } = req.params;
    
    // Important: Only include file data if files were actually uploaded
    // This prevents overwriting existing paths with undefined/null values
    const profileData = {
      ...req.body,
    };
    
    // Only add file objects if they exist
    if (req.files?.profilePic?.[0]) {
      profileData.profileImage = req.files.profilePic[0];
    }
    
    if (req.files?.certificate?.[0]) {
      profileData.certificate = req.files.certificate[0];
    }

    const result = await userService.updateUserProfile(regId, profileData);
    sendResponse(res, 200, true, 'Profile updated successfully', result);
  } catch (error) {
    console.error(' Update Profile Error:', error);
    const status = /not found/i.test(error.message) ? 404 : 500;
    sendResponse(res, status, false, error.message || 'Failed to update profile');
  }
};