const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/auth');
const searchController = require('../controllers/searchController');

router.post('/master',
  /* #swagger.tags = ['Search']
     #swagger.summary = 'Master search'
     #swagger.description = 'Perform a master search with filters and pagination. Returns paginated user data.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/MasterSearchRequest' }
     }
     #swagger.responses[200] = { description: 'Search completed successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authenticateToken, searchController.masterSearch
);

// Export grid data
router.post('/export',
  /* #swagger.tags = ['Search']
     #swagger.summary = 'Export search results to Excel'
     #swagger.description = 'Export master search results as an Excel (.xlsx) file download.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.produces = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/json']
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/MasterSearchRequest' }
     }
     #swagger.responses[200] = { description: 'Excel file downloaded or empty JSON if no data' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Export failed' }
  */
  authenticateToken, searchController.exportSearch
);

// Approve user
router.post('/approve/:regId',
  /* #swagger.tags = ['Search']
     #swagger.summary = 'Approve a user'
     #swagger.description = 'Approve a user registration by their registration ID.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['regId'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Registration ID of the user to approve',
       example: 1
     }
     #swagger.responses[200] = { description: 'User approved successfully' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Approval failed' }
  */
  authenticateToken, searchController.approveUser
);

// Update selected users
router.put('/update',
  /* #swagger.tags = ['Search']
     #swagger.summary = 'Bulk update selected users'
     #swagger.description = 'Update multiple users at once. Provide an array of user objects.'
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/BulkUpdateRequest' }
     }
     #swagger.responses[200] = { description: 'Users updated successfully' }
     #swagger.responses[400] = { description: 'No users provided or invalid data' }
     #swagger.responses[401] = { description: 'Unauthorized' }
     #swagger.responses[403] = { description: 'Forbidden' }
     #swagger.responses[500] = { description: 'Update failed' }
  */
  authenticateToken, searchController.updateSelected
);

module.exports = router;
