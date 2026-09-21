const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');
const { normalizeAllFilePaths, normalizeUserFilePaths } = require('../utils/dbPathNormalizer');
const { sendResponse } = require('../utils/response');
const logger = require('../utils/logger');

// Update User Role - Admin Only
router.put('/update-role',
  /* #swagger.tags = ['User Management']
     #swagger.summary = 'Update user role (Admin only)'
     #swagger.description = 'Update a user\'s role and permissions. Admin access required.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/UpdateRoleRequest' }
     }
     #swagger.responses[200] = { description: 'Role updated successfully' }
     #swagger.responses[400] = { description: 'Invalid input' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, userController.addUserRole
);

// Get User Profile 
router.get("/update-profile/:regId",
  /* #swagger.tags = ['User Management']
     #swagger.summary = 'Get user profile by registration ID'
     #swagger.description = 'Retrieve a user\'s full profile by their registration ID.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['regId'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Registration ID of the user',
       example: 1
     }
     #swagger.responses[200] = { description: 'User profile retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[404] = { description: 'User not found' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, userController.getUserProfile
);

// Update User Profile (with optional file upload)
router.put("/update-profile/:regId",
  /* #swagger.tags = ['User Management']
     #swagger.summary = 'Update user profile by registration ID'
     #swagger.description = 'Update a user\'s profile with optional file uploads (profile picture and certificate).'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['regId'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Registration ID of the user',
       example: 1
     }
     #swagger.parameters['firstName'] = { in: 'formData', type: 'string', description: 'First name' }
     #swagger.parameters['lastName'] = { in: 'formData', type: 'string', description: 'Last name' }
     #swagger.parameters['mobileNumber'] = { in: 'formData', type: 'string', description: '10-digit mobile number' }
     #swagger.parameters['address'] = { in: 'formData', type: 'string', description: 'Address' }
     #swagger.parameters['profilePic'] = { in: 'formData', type: 'file', description: 'Profile picture' }
     #swagger.parameters['certificate'] = { in: 'formData', type: 'file', description: 'Certificate document' }
     #swagger.responses[200] = { description: 'Profile updated successfully' }
     #swagger.responses[400] = { description: 'Invalid input data' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'certificate', maxCount: 1 }
  ]), userController.updateUserProfile
);

// Admin endpoint: Normalize all absolute paths in database to relative paths
router.post('/normalize-paths',
  /* #swagger.tags = ['Admin - Maintenance']
     #swagger.summary = 'Normalize all file paths in database (Admin only)'
     #swagger.description = 'Convert all absolute file paths in the database to relative paths.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Paths normalized successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[500] = { description: 'Failed to normalize paths' }
  */
  authenticateToken, async (req, res) => {
    try {
      const result = await normalizeAllFilePaths();
      sendResponse(res, 200, true, result.message, result);
    } catch (error) {
      logger.error('Normalize paths error', { error: error.message });
      sendResponse(res, 500, false, 'Failed to normalize paths');
    }
  }
);

// Admin endpoint: Normalize paths for specific users
router.post('/normalize-paths/:regIds',
  /* #swagger.tags = ['Admin - Maintenance']
     #swagger.summary = 'Normalize file paths for specific users (Admin only)'
     #swagger.description = 'Convert absolute file paths to relative for specific users by comma-separated registration IDs.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['regIds'] = {
       in: 'path',
       type: 'string',
       required: true,
       description: "Comma-separated registration IDs (e.g. 1,2,3)",
       example: "1,2,3"
     }
     #swagger.responses[200] = { description: 'Paths normalized successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[500] = { description: 'Failed to normalize paths' }
  */
  authenticateToken, async (req, res) => {
    try {
      const { regIds } = req.params;
      const idList = regIds.split(',').map(id => id.trim()).filter(id => id);
      const result = await normalizeUserFilePaths(idList);
      sendResponse(res, 200, true, result.message, result);
    } catch (error) {
      logger.error('Normalize paths error', { error: error.message });
      sendResponse(res, 500, false, 'Failed to normalize paths');
    }
  }
);

module.exports = router;
