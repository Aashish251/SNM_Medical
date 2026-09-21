const express = require("express");
const communityController = require("../controllers/communityController");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.post("/save-drive",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Create blood drive (legacy form endpoint)'
     #swagger.description = 'Compatibility endpoint for older forms. Prefer POST /api/community/blood-drives for new clients.'
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

router.post("/save-health-drive",
  /* #swagger.tags = ['Community']
     #swagger.summary = 'Create health drive (legacy form endpoint)'
     #swagger.description = 'Compatibility endpoint for older forms. Prefer POST /api/community/health-drives for new clients.'
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

router.post("/save-patient-registration",
  /* #swagger.tags = ['Patients']
     #swagger.summary = 'Create patient registration (legacy form endpoint)'
     #swagger.description = 'Compatibility endpoint for older forms. Prefer POST /api/patients for new clients.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/PatientRegistrationRequest' }
     }
     #swagger.responses[201] = { description: 'Patient registration saved successfully' }
     #swagger.responses[400] = { description: 'Invalid patient registration data' }
     #swagger.responses[500] = { description: 'Failed to save patient registration' }
  */
  patientController.createPatientRegistration
);

module.exports = router;
