const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload');
const { normalizeAllFilePaths, normalizeUserFilePaths } = require('../utils/dbPathNormalizer');
const { sendResponse } = require('../utils/response');

/**
 * @swagger
 * /api/user/update-role:
 *   put:
 *     tags: [User Management]
 *     summary: Update user role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: number
 *               isPresent:
 *                 type: boolean
 *               passEntry:
 *                 type: boolean
 *               isDeleted:
 *                 type: boolean
 *               isAdmin:
 *                 type: boolean
 *               remark:
 *                 type: string
 *               sewaLocationId:
 *                 type: number
 *               samagamHeldIn:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Update User Role - Admin Only
router.put('/update-role',authenticateToken, userController.addUserRole);

// Get User Profile 
router.get("/update-profile/:regId", authenticateToken, userController.getUserProfile);

// Update User Profile (with optional file upload)
router.put("/update-profile/:regId", authenticateToken, upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'certificate', maxCount: 1 }
]), userController.updateUserProfile);

/**
 * @swagger
 * /api/user/normalize-paths:
 *   post:
 *     tags: [Admin - Maintenance]
 *     summary: Normalize all absolute file paths in database to relative paths (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Paths normalized successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Admin endpoint: Normalize all absolute paths in database to relative paths
router.post('/normalize-paths', authenticateToken, async (req, res) => {
  try {
    // In production, you may want to check for admin role here
    const result = await normalizeAllFilePaths();
    sendResponse(res, 200, true, result.message, result);
  } catch (error) {
    console.error('Error in normalize-paths endpoint:', error);
    sendResponse(res, 500, false, 'Failed to normalize paths');
  }
});

/**
 * @swagger
 * /api/user/normalize-paths/:regIds:
 *   post:
 *     tags: [Admin - Maintenance]
 *     summary: Normalize file paths for specific users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: regIds
 *         required: true
 *         schema:
 *           type: string
 *         description: Comma-separated registration IDs
 *     responses:
 *       200:
 *         description: Paths normalized successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
// Admin endpoint: Normalize paths for specific users
router.post('/normalize-paths/:regIds', authenticateToken, async (req, res) => {
  try {
    const { regIds } = req.params;
    const idList = regIds.split(',').map(id => id.trim()).filter(id => id);
    const result = await normalizeUserFilePaths(idList);
    sendResponse(res, 200, true, result.message, result);
  } catch (error) {
    console.error('Error in normalize-paths endpoint:', error);
    sendResponse(res, 500, false, 'Failed to normalize paths');
  }
});

module.exports = router;
