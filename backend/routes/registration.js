const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { promisePool } = require('../config/database');

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Validators
const validators = {
  email: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  mobile: (mobile) => /^[6-9][0-9]{9}$/.test(mobile),
  password: (password) => password && password.length >= 8,
  name: (name) => /^[a-zA-Z\s]{2,50}$/.test(name)
};

// 🔹 Get dropdown data - FIXED for malformed packet
// 🔹 Get dropdown data using stored procedures - FIXED
router.get('/dropdown-data', async (req, res) => {
  try {
    console.log('Fetching dropdown data using stored procedures...');

    // Always pass required parameters (0 or NULL based on your SP design)
    const [statesResult] = await promisePool.execute(
      'CALL sp_get_state_details(?)',
      [null]   //  fetch all states
    );

    const [departmentsResult] = await promisePool.execute(
      'CALL sp_get_department_by_id(?)',
      [0]      //  fetch all departments
    );

    const [qualificationsResult] = await promisePool.execute(
      'CALL sp_get_qualification_by_id(?)',
      [0]      //  fetch all qualifications
    );

    res.json({
      success: true,
      message: 'Dropdown data fetched successfully',
      data: {
        states: statesResult[0] || [],
        departments: departmentsResult[0] || [],
        qualifications: qualificationsResult[0] || []
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

// 🔹 Get cities - FIXED
router.get('/cities/:stateId', async (req, res) => {
  let connection;
  
  try {
    const { stateId } = req.params;
    
    if (!stateId || isNaN(stateId) || parseInt(stateId) <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid state ID is required' 
      });
    }

    //  FIXED: Use dedicated connection
    connection = await promisePool.getConnection();
    const [citiesResult] = await connection.execute('CALL sp_get_city_details(?)', [stateId]);
    const cities = citiesResult[0] || [];

    res.json({
      success: true,
      message: cities.length > 0 ? 'Cities fetched successfully using fixed SP' : 'No cities found',
      data: cities,
      count: cities.length
    });

  } catch (error) {
    console.error('Cities fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cities' });
  } finally {
    if (connection) connection.release();
  }
});

// 🔹 Check email - FIXED
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
    
    if (!validators.email(sanitizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    //  FIXED: Simple query to avoid SP issues for basic operations
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
    res.status(500).json({ success: false, message: 'Failed to check email availability' });
  }
});

// 🔹 Register user - FIXED
router.post('/register', async (req, res) => {
  let connection;
  
  try {
    const {
      fullName, email, password, confirmPassword, mobileNo, dateOfBirth,
      address, stateId, cityId, departmentId, qualificationId,
      userType = 'ms', title = 'Mr', gender = 1, experience = 0,
      lastSewa = '', recommendedBy = ''
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

    // Validation
    if (!sanitizedData.fullName || !sanitizedData.email || !password || !sanitizedData.mobileNo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Full name, email, password, and mobile number are required' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (!validators.email(sanitizedData.email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    if (!validators.mobile(sanitizedData.mobileNo)) {
      return res.status(400).json({ success: false, message: 'Invalid mobile number' });
    }

    if (!validators.password(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Check existing
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
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    if (existingMobile.length > 0) {
      return res.status(409).json({ success: false, message: 'Mobile number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const loginId = `${sanitizedData.userType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    let genderValue = gender;
    if (typeof gender === 'string') {
      genderValue = gender.toLowerCase() === 'male' ? 1 : gender.toLowerCase() === 'female' ? 2 : 3;
    }

    //  FIXED: Use dedicated connection for SP call
    connection = await promisePool.getConnection();
    
    await connection.execute(
      `CALL sp_save_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'INSERT', 0, sanitizedData.userType, loginId, sanitizedData.title,
        sanitizedData.fullName, sanitizedData.email, hashedPassword, 
        sanitizedData.mobileNo, dateOfBirth || null, genderValue,
        sanitizedData.address || '', parseInt(stateId) || 0, parseInt(cityId) || 0,
        parseInt(qualificationId) || 0, parseInt(departmentId) || 0, 1, 1, '', '',
        1, 0, 1, '', parseFloat(experience) || 0.0, sanitizedData.lastSewa,
        sanitizedData.recommendedBy, '', 0
      ]
    );

    console.log('User registered successfully using fixed SP:', sanitizedData.email);

    res.status(201).json({
      success: true,
      message: 'Registration successful using stored procedures!',
      data: {
        email: sanitizedData.email,
        fullName: sanitizedData.fullName,
        userType: sanitizedData.userType,
        loginId: loginId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email or mobile already registered' });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
