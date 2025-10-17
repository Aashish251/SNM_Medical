// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Login with role validation
router.post('/login', authController.login);

// Simple login (no role validation)
router.post('/login-simple', authController.loginSimple);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
