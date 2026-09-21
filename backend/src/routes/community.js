const express = require("express");
const communityController = require("../controllers/communityController");

const router = express.Router();

router.get("/blood-drives",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'List blood drives'
     #swagger.description = 'Retrieve all blood donation drives sorted by newest drive date first.'
     #swagger.responses[200] = { description: 'Blood drives fetched successfully' }
     #swagger.responses[500] = { description: 'Failed to fetch blood drives' }
  */
  communityController.listBloodDrives
);

router.get("/blood-drives/:id",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Get blood drive by ID'
     #swagger.description = 'Retrieve one blood donation drive by its numeric ID.'
     #swagger.parameters['id'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Blood drive ID',
       example: 1
     }
     #swagger.responses[200] = { description: 'Blood drive fetched successfully' }
     #swagger.responses[404] = { description: 'Blood drive not found' }
     #swagger.responses[500] = { description: 'Failed to fetch blood drive' }
  */
  communityController.getBloodDriveById
);

router.post("/blood-drives",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Create blood drive'
     #swagger.description = 'Create a new blood donation drive.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/BloodDriveRequest' }
     }
     #swagger.responses[201] = { description: 'Blood drive saved successfully' }
     #swagger.responses[400] = { description: 'Invalid blood drive data' }
     #swagger.responses[500] = { description: 'Failed to save blood drive' }
  */
  communityController.createBloodDrive
);

router.post("/blood-drives/:id/eligibility-check",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Check blood donation eligibility for a drive'
     #swagger.description = 'Check whether a person is eligible to donate blood and attach the check to a drive ID.'
     #swagger.parameters['id'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Blood drive ID',
       example: 1
     }
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/BloodDonationEligibilityRequest' }
     }
     #swagger.responses[200] = { description: 'Eligibility checked successfully' }
     #swagger.responses[400] = { description: 'Invalid eligibility input' }
     #swagger.responses[500] = { description: 'Failed to check eligibility' }
  */
  communityController.checkEligibility
);

router.post("/eligibility-check",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Check blood donation eligibility'
     #swagger.description = 'Check whether a person is eligible to donate blood.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/BloodDonationEligibilityRequest' }
     }
     #swagger.responses[200] = { description: 'Eligibility checked successfully' }
     #swagger.responses[400] = { description: 'Invalid eligibility input' }
     #swagger.responses[500] = { description: 'Failed to check eligibility' }
  */
  communityController.checkEligibility
);

router.get("/health-drives",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'List health drives'
     #swagger.description = 'Retrieve all health drives sorted by newest camp date first.'
     #swagger.responses[200] = { description: 'Health drives fetched successfully' }
     #swagger.responses[500] = { description: 'Failed to fetch health drives' }
  */
  communityController.listHealthDrives
);

router.get("/health-drives/:id",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Get health drive by ID'
     #swagger.description = 'Retrieve one health drive by its numeric ID.'
     #swagger.parameters['id'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Health drive ID',
       example: 1
     }
     #swagger.responses[200] = { description: 'Health drive fetched successfully' }
     #swagger.responses[404] = { description: 'Health drive not found' }
     #swagger.responses[500] = { description: 'Failed to fetch health drive' }
  */
  communityController.getHealthDriveById
);

router.post("/health-drives",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Create health drive'
     #swagger.description = 'Create a new health drive or medical camp.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/HealthDriveRequest' }
     }
     #swagger.responses[201] = { description: 'Health drive saved successfully' }
     #swagger.responses[400] = { description: 'Invalid health drive data' }
     #swagger.responses[500] = { description: 'Failed to save health drive' }
  */
  communityController.createHealthDrive
);

module.exports = router;
