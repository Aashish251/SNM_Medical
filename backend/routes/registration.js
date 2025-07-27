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
    // At least 8 chars
    return password && password.length >= 8;
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
    
    if (!stateId || isNaN(stateId) || parseInt(stateId) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid state ID is required'
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
      message: 'Failed to fetch cities'
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

    if (!validators.email(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    //  FIXED: Use reg_id instead of id
    const [existingUsers] = await promisePool.execute(
      'SELECT reg_id FROM registration_tbl WHERE email = ? AND is_deleted = 0',
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
      message: 'Failed to check email availability'
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
      userType = 'ms',
      title = 'Mr',
      gender = 1, // Default to male (1)
      availability = 'Weekdays',
      shift = 'Morning',
      experience = 0,
      lastSewa = '',
      recommendedBy = ''
    } = req.body;

    console.log('Registration attempt for:', email);

    // Sanitize inputs
    const sanitizedData = {
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email?.toLowerCase()),
      mobileNo: sanitizeInput(mobileNo),
      address: sanitizeInput(address),
      userType: sanitizeInput(userType),
      title: sanitizeInput(title),
      lastSewa: sanitizeInput(lastSewa) || '',
      recommendedBy: sanitizeInput(recommendedBy) || ''
    };

    // Basic validation
    if (!sanitizedData.fullName || !sanitizedData.email || !password || !sanitizedData.mobileNo) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, password, and mobile number are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (!validators.email(sanitizedData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    if (!validators.mobile(sanitizedData.mobileNo)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      });
    }

    if (!validators.password(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    //  FIXED: Check for existing email and mobile with reg_id
    const [
      [existingUsers],
      [existingMobile]
    ] = await Promise.all([
      promisePool.execute(
        'SELECT reg_id FROM registration_tbl WHERE email = ? AND is_deleted = 0',
        [sanitizedData.email]
      ),
      promisePool.execute(
        'SELECT reg_id FROM registration_tbl WHERE mobile_no = ? AND is_deleted = 0',
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

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate unique login_id
    const loginId = `${sanitizedData.userType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    // Map gender string to number if needed
    let genderValue = gender;
    if (typeof gender === 'string') {
      genderValue = gender.toLowerCase() === 'male' ? 1 : gender.toLowerCase() === 'female' ? 2 : 3;
    }

    // Start transaction
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    try {
      //  FIXED: Insert with correct column names matching your table structure
      const [registrationResult] = await connection.execute(`
        INSERT INTO registration_tbl (
          user_type, login_id, title, full_name, email, password, mobile_no, 
          dob, gender, address, state_id, city_id, qualification_id, department_id,
          available_day_id, shifttime_id, profile_img_path, certificate_doc_path,
          is_present, pass_entry, sewa_location_id, remark, created_datetime, 
          updated_datetime, is_deleted, total_exp, prev_sewa_perform, recom_by, samagam_held_in
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 0, ?, ?, ?, ?)
      `, [
        sanitizedData.userType,           // user_type
        loginId,                          // login_id
        sanitizedData.title,              // title
        sanitizedData.fullName,           // full_name
        sanitizedData.email,              // email
        hashedPassword,                   // password
        sanitizedData.mobileNo,           // mobile_no
        dateOfBirth || null,              // dob
        genderValue,                      // gender (int)
        sanitizedData.address || '',      // address
        stateId || 0,                     // state_id
        cityId || 0,                      // city_id
        qualificationId || 0,             // qualification_id
        departmentId || 0,                // department_id
        1,                                // available_day_id (default to 1)
        1,                                // shifttime_id (default to 1)
        '',                               // profile_img_path (empty for now)
        '',                               // certificate_doc_path (empty for now)
        1,                                // is_present (default to 1)
        0,                                // pass_entry (default to 0)
        1,                                // sewa_location_id (default to 1)
        '',                               // remark (empty for now)
        parseFloat(experience) || 0.0,    // total_exp
        sanitizedData.lastSewa,           // prev_sewa_perform
        sanitizedData.recommendedBy,      // recom_by
        ''                                // samagam_held_in (empty for now)
      ]);

      const newUserId = registrationResult.insertId;

      // Commit transaction
      await connection.commit();

      console.log('User registered successfully:', sanitizedData.email);

      // Return success response
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
      return res.status(409).json({
        success: false,
        message: 'Email or mobile number is already registered'
      });
    }

    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        success: false,
        message: 'Database field error. Please contact administrator.'
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

// Get registration statistics
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
