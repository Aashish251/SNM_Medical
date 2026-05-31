// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Login with role validation
router.post('/login',
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Login user'
     #swagger.description = 'Authenticate user with email, password, and role. Returns a JWT token on success.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/LoginRequest' }
     }
     #swagger.responses[200] = { description: 'Login successful' }
     #swagger.responses[400] = { description: 'Invalid request - missing required fields' }
     #swagger.responses[401] = { description: 'Unauthorized - invalid credentials' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authController.login
);

// Forgot password
router.post('/forgot-password-validate',
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Validate forgot password request'
     #swagger.description = 'Validate user identity before allowing password reset. Verifies email, mobile number, and date of birth.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/ForgotPasswordRequest' }
     }
     #swagger.responses[200] = { description: 'Validation successful - user identity confirmed' }
     #swagger.responses[400] = { description: 'Validation failed - user not found or details mismatch' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authController.validateForgotPassword
);

// Reset password
router.post('/reset-password',
  /* #swagger.tags = ['Authentication']
     #swagger.summary = 'Reset user password'
     #swagger.description = 'Reset the password for a verified user using their registration ID.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: { $ref: '#/definitions/ResetPasswordRequest' }
     }
     #swagger.responses[200] = { description: 'Password reset successful' }
     #swagger.responses[400] = { description: 'Invalid request - missing regId or newPassword' }
     #swagger.responses[500] = { description: 'Internal server error' }
  */
  authController.resetPassword
);

module.exports = router;
