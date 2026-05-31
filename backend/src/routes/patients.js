const express = require("express");
const patientController = require("../controllers/patientController");

const router = express.Router();

router.get("/",
  /* #swagger.tags = ['Patients']
     #swagger.summary = 'List patient registrations'
     #swagger.description = 'Retrieve all patient registrations sorted by newest registration date first.'
     #swagger.responses[200] = {
       description: 'Patient registrations fetched successfully',
       schema: {
         success: true,
         message: 'Patient registrations fetched successfully',
         data: {
           items: [{ id: 1, regnNo: 'OPD-2026-001', patientName: 'Anita Sharma' }],
           count: 1
         }
       }
     }
     #swagger.responses[500] = { description: 'Failed to fetch patient registrations' }
  */
  patientController.listPatientRegistrations
);

router.get("/:id",
  /* #swagger.tags = ['Patients']
     #swagger.summary = 'Get patient registration by ID'
     #swagger.description = 'Retrieve one patient registration record by its numeric ID.'
     #swagger.parameters['id'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'Patient registration ID',
       example: 1
     }
     #swagger.responses[200] = { description: 'Patient registration fetched successfully' }
     #swagger.responses[404] = { description: 'Patient registration not found' }
     #swagger.responses[500] = { description: 'Failed to fetch patient registration' }
  */
  patientController.getPatientRegistrationById
);

router.post("/",
  /* #swagger.tags = ['Patients']
     #swagger.summary = 'Create patient registration'
     #swagger.description = 'Save a patient registration. The API accepts both UI field names (regn, name, mobile, sex, symptoms) and normalized API field names.'
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
