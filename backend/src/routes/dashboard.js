const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const authenticateToken = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/role');

// User routes
router.get('/stats',
  /* #swagger.tags = ['Dashboard']
     #swagger.summary = 'Get dashboard statistics'
     #swagger.description = 'Retrieve dashboard statistics for the authenticated user.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Statistics retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized - no token or invalid token' }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, dashboardController.getStats
);

router.get('/profile',
  /* #swagger.tags = ['Dashboard']
     #swagger.summary = 'Get user profile'
     #swagger.description = 'Retrieve the profile of the currently authenticated user.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Profile retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, dashboardController.getProfile
);

router.put('/profile',
  /* #swagger.tags = ['Dashboard']
     #swagger.summary = 'Update user profile'
     #swagger.description = 'Update the profile of the currently authenticated user.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         firstName: 'John',
         lastName: 'Doe',
         mobileNumber: '9876543210',
         address: '123 Main Street'
       }
     }
     #swagger.responses[200] = { description: 'Profile updated successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, dashboardController.updateProfile
);

// Admin routes
router.get('/summary',
  /* #swagger.tags = ['Dashboard']
     #swagger.summary = 'Get admin summary (Admin only)'
     #swagger.description = 'Retrieve admin dashboard summary with aggregated stats. Requires admin role.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Admin summary retrieved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden - admin role required' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, isAdmin, dashboardController.getAdminSummary
);

module.exports = router;
