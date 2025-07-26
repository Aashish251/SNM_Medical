const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { promisePool } = require('../config/database');

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Validation helper functions
const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  mobile: (mobile) => {
    const mobileRegex = /^[6-9][0-9]{9}$/; // Indian mobile format
    return mobileRegex.test(mobile);
  },
  password: (password) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
  name: (name) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name);
  }
};

// Get dropdown data for registration form
router.get('/dropdown-data', async (req, res) => {
  try {
    console.log('Fetching dropdown data for registration form...');

    // Use Promise.all for better performance
    const [
      [states],
      [departments], 
      [qualifications]
    ] = await Promise.all([
      promisePool.execute(`
        SELECT id, state_name 
        FROM state_tbl 
        WHERE is_deleted = 0 
        ORDER BY state_name ASC
      `),
      promisePool.execute(`
        SELECT id, department_name 
        FROM department_tbl 
        WHERE is_deleted = 0 
        ORDER BY department_name ASC
      `),
      promisePool.execute(`
        SELECT id, qualification_name 
        FROM qualification_tbl 
        WHERE is_deleted = 0 
        ORDER BY qualification_name ASC
      `)
    ]);

    // Add data validation
    if (!states || !departments || !qualifications) {
      throw new Error('Failed to fetch all dropdown data');
    }

    res.json({
      success: true,
      message: 'Dropdown data fetched successfully',
      data: {
        states: states || [],
        departments: departments || [],
        qualifications: qualifications || []
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dropdown data error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dropdown data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get cities by state ID
router.get('/cities/:stateId', async (req, res) => {
  try {
    const { stateId } = req.params;
    
    // Enhanced validation
    if (!stateId || isNaN(stateId) || parseInt(stateId) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid state ID is required'
      });
    }

    // Check if state exists first
    const [stateExists] = await promisePool.execute(
      'SELECT id FROM state_tbl WHERE id = ? AND is_deleted = 0',
      [stateId]
    );

    if (stateExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'State not found'
      });
    }

    const [cities] = await promisePool.execute(`
      SELECT id, city_name 
      FROM city_tbl 
      WHERE state_id = ? AND is_deleted = 0 
      ORDER BY city_name ASC
    `, [stateId]);

    res.json({
      success: true,
      message: cities.length > 0 ? 'Cities fetched successfully' : 'No cities found for this state',
      data: cities || [],
      count: cities.length
    });

  } catch (error) {
    console.error('Cities fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch cities',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Check if email already exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());

    // Validate email format
    if (!validators.email(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const [existingUsers] = await promisePool.execute(
      'SELECT id FROM registration_tbl WHERE email = ? AND is_deleted = 0',
      [sanitizedEmail]
    );

    res.json({
      success: true,
      exists: existingUsers.length > 0,
      message: existingUsers.length > 0 ? 'Email already exists' : 'Email available'
    });

  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check email availability',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  let connection;
  
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      mobileNo,
      dateOfBirth,
      address,
      stateId,
      cityId,
      departmentId,
      qualificationId,
      userType = 'ms'
    } = req.body;

    console.log('Registration attempt for:', email);

    // Sanitize inputs
    const sanitizedData = {
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email?.toLowerCase()),
      mobileNo: sanitizeInput(mobileNo),
      address: sanitizeInput(address),
      userType: sanitizeInput(userType)
    };

    // Enhanced validation
    const validationErrors = [];

    if (!sanitizedData.fullName || !validators.name(sanitizedData.fullName)) {
      validationErrors.push('Full name must be 2-50 characters and contain only letters and spaces');
    }

    if (!sanitizedData.email || !validators.email(sanitizedData.email)) {
      validationErrors.push('Please enter a valid email address');
    }

    if (!password || !validators.password(password)) {
      validationErrors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    if (password !== confirmPassword) {
      validationErrors.push('Passwords do not match');
    }

    if (!sanitizedData.mobileNo || !validators.mobile(sanitizedData.mobileNo)) {
      validationErrors.push('Please enter a valid 10-digit Indian mobile number');
    }

    if (!['admin', 'ms'].includes(sanitizedData.userType)) {
      validationErrors.push('Invalid user type');
    }

    // Date validation
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 18 || age > 100) {
        validationErrors.push('Age must be between 18 and 100 years');
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check for existing email and mobile in parallel
    const [
      [existingUsers],
      [existingMobile]
    ] = await Promise.all([
      promisePool.execute(
        'SELECT id FROM registration_tbl WHERE email = ? AND is_deleted = 0',
        [sanitizedData.email]
      ),
      promisePool.execute(
        'SELECT id FROM registration_tbl WHERE mobile_no = ? AND is_deleted = 0',
        [sanitizedData.mobileNo]
      )
    ]);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered'
      });
    }

    if (existingMobile.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Mobile number is already registered'
      });
    }

    // Validate foreign key references if provided
    if (stateId || cityId || departmentId || qualificationId) {
      const validationPromises = [];
      
      if (stateId) {
        validationPromises.push(
          promisePool.execute('SELECT id FROM state_tbl WHERE id = ? AND is_deleted = 0', [stateId])
        );
      }
      
      if (cityId) {
        validationPromises.push(
          promisePool.execute('SELECT id FROM city_tbl WHERE id = ? AND is_deleted = 0', [cityId])
        );
      }
      
      if (departmentId) {
        validationPromises.push(
          promisePool.execute('SELECT id FROM department_tbl WHERE id = ? AND is_deleted = 0', [departmentId])
        );
      }
      
      if (qualificationId) {
        validationPromises.push(
          promisePool.execute('SELECT id FROM qualification_tbl WHERE id = ? AND is_deleted = 0', [qualificationId])
        );
      }

      const validationResults = await Promise.all(validationPromises);
      const invalidReferences = validationResults.some(([result]) => result.length === 0);
      
      if (invalidReferences) {
        return res.status(400).json({
          success: false,
          message: 'Invalid reference data provided'
        });
      }
    }

    // Hash password with higher cost factor for better security
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Start transaction
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert into registration_tbl
      const [registrationResult] = await connection.execute(`
        INSERT INTO registration_tbl (
          full_name, email, mobile_no, dob, address, 
          state_id, city_id, department_id, qualification_id, 
          user_type, password, is_deleted, created_datetime, updated_datetime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
      `, [
        sanitizedData.fullName,
        sanitizedData.email,
        sanitizedData.mobileNo,
        dateOfBirth || null,
        sanitizedData.address || null,
        stateId || null,
        cityId || null,
        departmentId || null,
        qualificationId || null,
        sanitizedData.userType,
        hashedPassword
      ]);

      const newUserId = registrationResult.insertId;

      // Generate unique login_id
      const loginId = `${sanitizedData.userType}_${newUserId}_${Date.now()}`;

      // Create login entry (with better error handling)
      try {
        const [loginTableExists] = await connection.execute(
          "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'login_tbl'"
        );
        
        if (loginTableExists[0].count > 0) {
          await connection.execute(`
            INSERT INTO login_tbl (reg_id, login_id, password, is_deleted, created_datetime)
            VALUES (?, ?, ?, 0, NOW())
          `, [newUserId, loginId, hashedPassword]);
        }
      } catch (loginError) {
        console.log('Login table operation skipped:', loginError.message);
      }

      // Commit transaction
      await connection.commit();

      console.log('User registered successfully:', sanitizedData.email);

      // Return success response with limited user data
      res.status(201).json({
        success: true,
        message: 'Registration successful! You can now login with your credentials.',
        data: {
          userId: newUserId,
          email: sanitizedData.email,
          fullName: sanitizedData.fullName,
          userType: sanitizedData.userType,
          loginId: loginId
        },
        timestamp: new Date().toISOString()
      });

    } catch (transactionError) {
      // Rollback transaction
      await connection.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      const field = error.message.includes('email') ? 'email' : 
                   error.message.includes('mobile') ? 'mobile number' : 'field';
      
      return res.status(409).json({
        success: false,
        message: `This ${field} is already registered`
      });
    }

    if (error.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({
        success: false,
        message: 'One or more fields exceed maximum length'
      });
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reference data provided'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });

  } finally {
    // Ensure connection is released
    if (connection) {
      connection.release();
    }
  }
});

// Get registration statistics (Admin only)
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await promisePool.execute(`
      SELECT 
        user_type,
        COUNT(*) as count,
        DATE(created_datetime) as date
      FROM registration_tbl 
      WHERE is_deleted = 0 
      GROUP BY user_type, DATE(created_datetime)
      ORDER BY date DESC
      LIMIT 30
    `);

    const [totalCount] = await promisePool.execute(
      'SELECT COUNT(*) as total FROM registration_tbl WHERE is_deleted = 0'
    );

    res.json({
      success: true,
      data: {
        stats: stats || [],
        total: totalCount[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch registration statistics'
    });
  }
});

module.exports = router;
