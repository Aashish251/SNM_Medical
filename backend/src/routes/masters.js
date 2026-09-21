const express = require("express");
const masterDataController = require("../controllers/masterDataController");

const router = express.Router();

router.get("/modules",
  /* #swagger.tags = ['Masters']
     #swagger.summary = 'List master data modules'
     #swagger.description = 'Retrieve supported master modules and active record counts.'
     #swagger.responses[200] = { description: 'Master modules fetched successfully' }
     #swagger.responses[500] = { description: 'Failed to fetch master modules' }
  */
  masterDataController.listModules
);

router.get("/:module",
  /* #swagger.tags = ['Masters']
     #swagger.summary = 'List master records'
     #swagger.description = 'Retrieve active records for a supported master module. Supported modules: qualification, department, sewalocation, shifttime, availableday, state, city.'
     #swagger.parameters['module'] = {
       in: 'path',
       type: 'string',
       required: true,
       description: 'Master module name',
       enum: ['qualification', 'department', 'sewalocation', 'shifttime', 'availableday', 'state', 'city'],
       example: 'department'
     }
     #swagger.parameters['search'] = {
       in: 'query',
       type: 'string',
       required: false,
       description: 'Optional case-insensitive search text',
       example: 'cardio'
     }
     #swagger.responses[200] = { description: 'Master records fetched successfully' }
     #swagger.responses[400] = { description: 'Unsupported master module' }
     #swagger.responses[500] = { description: 'Failed to fetch master records' }
  */
  masterDataController.listItems
);

router.post("/:module",
  /* #swagger.tags = ['Masters']
     #swagger.summary = 'Create master record'
     #swagger.description = 'Create a record in a supported master module. State requires countryId/extraId; city requires stateId/extraId.'
     #swagger.parameters['module'] = {
       in: 'path',
       type: 'string',
       required: true,
       description: 'Master module name',
       enum: ['qualification', 'department', 'sewalocation', 'shifttime', 'availableday', 'state', 'city'],
       example: 'department'
     }
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/MasterDataRequest' }
     }
     #swagger.responses[201] = { description: 'Master record created successfully' }
     #swagger.responses[400] = { description: 'Invalid master record data' }
     #swagger.responses[500] = { description: 'Failed to create master record' }
  */
  masterDataController.createItem
);

router.put("/:module/:id",
  /* #swagger.tags = ['Masters']
     #swagger.summary = 'Update master record'
     #swagger.description = 'Update an active record in a supported master module.'
     #swagger.parameters['module'] = {
       in: 'path',
       type: 'string',
       required: true,
       description: 'Master module name',
       enum: ['qualification', 'department', 'sewalocation', 'shifttime', 'availableday', 'state', 'city'],
       example: 'department'
     }
     #swagger.parameters['id'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Master record ID',
       example: 1
     }
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/MasterDataRequest' }
     }
     #swagger.responses[200] = { description: 'Master record updated successfully' }
     #swagger.responses[400] = { description: 'Invalid master record data' }
     #swagger.responses[404] = { description: 'Master record not found' }
     #swagger.responses[500] = { description: 'Failed to update master record' }
  */
  masterDataController.updateItem
);

router.delete("/:module/:id",
  /* #swagger.tags = ['Masters']
     #swagger.summary = 'Delete master record'
     #swagger.description = 'Soft-delete an active record in a supported master module.'
     #swagger.parameters['module'] = {
       in: 'path',
       type: 'string',
       required: true,
       description: 'Master module name',
       enum: ['qualification', 'department', 'sewalocation', 'shifttime', 'availableday', 'state', 'city'],
       example: 'department'
     }
     #swagger.parameters['id'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Master record ID',
       example: 1
     }
     #swagger.parameters['body'] = {
       in: 'body',
       required: false,
       schema: { updatedBy: 1 }
     }
     #swagger.responses[200] = { description: 'Master record deleted successfully' }
     #swagger.responses[404] = { description: 'Master record not found' }
     #swagger.responses[500] = { description: 'Failed to delete master record' }
  */
  masterDataController.deleteItem
);

module.exports = router;
