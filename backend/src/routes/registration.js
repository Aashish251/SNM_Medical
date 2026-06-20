const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const registrationController = require('../controllers/registration');
const { uploadFileToS3 } = require('../utils/filePathHelper');

router.get('/dropdown-data',
  /* #swagger.tags = ['Registration']
     #swagger.summary = 'Get dropdown master data'
     #swagger.description = 'Retrieve all dropdown master data (states, departments, qualifications) used in registration forms.'
     #swagger.responses[200] = { description: 'Successfully fetched dropdown data' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  registrationController.getDropdownData
);

router.get('/cities/:stateId',
  /* #swagger.tags = ['Registration']
     #swagger.summary = 'Get cities by state'
     #swagger.description = 'Get list of cities for a given state ID.'
     #swagger.parameters['stateId'] = {
       in: 'path',
       type: 'integer',
       required: true,
       description: 'ID of the state to get cities for',
       example: 1
     }
     #swagger.responses[200] = { description: 'Cities retrieved successfully' }
     #swagger.responses[400] = { description: 'Invalid state ID' }
     #swagger.responses[404] = { description: 'State not found' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  registrationController.getCities
);

router.post('/check-email',
  /* #swagger.tags = ['Registration']
     #swagger.summary = 'Check email availability'
     #swagger.description = 'Check if an email address is already registered in the system.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         $email: 'john.doe@example.com'
       }
     }
     #swagger.responses[200] = { description: 'Email check completed' }
     #swagger.responses[400] = { description: 'Invalid email format' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  registrationController.checkEmail
);

router.post('/register',
  /* #swagger.tags = ['Registration']
     #swagger.summary = 'Register new user'
     #swagger.description = 'Create a new user account with profile details. Supports file uploads for profile picture and certificate.'
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['firstName'] = { in: 'formData', type: 'string', required: true, description: 'First name', example: 'John' }
     #swagger.parameters['lastName'] = { in: 'formData', type: 'string', required: true, description: 'Last name', example: 'Doe' }
     #swagger.parameters['email'] = { in: 'formData', type: 'string', required: true, description: 'Email address', example: 'john.doe@example.com' }
     #swagger.parameters['password'] = { in: 'formData', type: 'string', required: true, description: 'Password (min 8 chars)', example: 'Password123!' }
     #swagger.parameters['mobileNumber'] = { in: 'formData', type: 'string', required: true, description: '10-digit mobile number', example: '9876543210' }
     #swagger.parameters['role'] = { in: 'formData', type: 'string', required: true, enum: ['user', 'admin', 'medical_staff'], description: 'User role', example: 'medical_staff' }
     #swagger.parameters['gender'] = { in: 'formData', type: 'string', enum: ['Male', 'Female', 'Other'], description: 'Gender' }
     #swagger.parameters['dateOfBirth'] = { in: 'formData', type: 'string', description: 'Date of birth (YYYY-MM-DD)' }
     #swagger.parameters['stateId'] = { in: 'formData', type: 'integer', description: 'State ID' }
     #swagger.parameters['cityId'] = { in: 'formData', type: 'integer', description: 'City ID' }
     #swagger.parameters['address'] = { in: 'formData', type: 'string', description: 'Address (max 200 chars)' }
     #swagger.parameters['pincode'] = { in: 'formData', type: 'string', description: '6-digit pincode' }
     #swagger.parameters['specialization'] = { in: 'formData', type: 'string', description: 'Medical specialization' }
     #swagger.parameters['experience'] = { in: 'formData', type: 'integer', description: 'Years of experience' }
     #swagger.parameters['profilePic'] = { in: 'formData', type: 'file', description: 'Profile picture' }
     #swagger.parameters['certificate'] = { in: 'formData', type: 'file', description: 'Certificate document' }
     #swagger.responses[201] = { description: 'User registered successfully' }
     #swagger.responses[400] = { description: 'Invalid input data' }
     #swagger.responses[409] = { description: 'Email already exists' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
  ]),
  registrationController.registerUser
);

router.post('/upload-profile',
  /* #swagger.tags = ['Registration']
     #swagger.summary = 'Upload profile image'
     #swagger.description = 'Upload a profile image separately. Returns the file path.'
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['profileImage'] = { in: 'formData', type: 'file', required: true, description: 'Profile image file' }
     #swagger.responses[200] = { description: 'Profile image uploaded successfully' }
     #swagger.responses[400] = { description: 'No profile image uploaded' }
  */
  upload.single('profileImage'), async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile image uploaded',
      });
    }

    try {
      const filePath = await uploadFileToS3(req.file, 'profile');
      res.json({
        success: true,
        message: 'Profile image uploaded successfully',
        filePath,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/upload-certificate',
  /* #swagger.tags = ['Registration']
     #swagger.summary = 'Upload certificate document'
     #swagger.description = 'Upload a certificate document separately. Returns the file path.'
     #swagger.consumes = ['multipart/form-data']
     #swagger.parameters['certificate'] = { in: 'formData', type: 'file', required: true, description: 'Certificate file' }
     #swagger.responses[200] = { description: 'Certificate uploaded successfully' }
     #swagger.responses[400] = { description: 'No certificate uploaded' }
  */
  upload.single('certificate'), async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No certificate uploaded',
      });
    }

    try {
      const filePath = await uploadFileToS3(req.file, 'certificates');
      res.json({
        success: true,
        message: 'Certificate uploaded successfully',
        filePath,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
