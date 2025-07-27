const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { promisePool } = require('../config/database');

// Get dashboard statistics from actual database
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Fetching dashboard statistics for user:', req.user?.userId);

    // Test database connection first
    const [connectionTest] = await promisePool.execute('SELECT 1 as test');
    console.log(' Database connection OK');

    // Get total users
    const [userCount] = await promisePool.execute(`
      SELECT COUNT(*) as total FROM registration_tbl WHERE is_deleted = 0
    `);
    const totalUsers = userCount[0]?.total || 0;
    console.log(' Total users:', totalUsers);

    //  FIXED: Get recent registrations with compatible date syntax
    const [recentCount] = await promisePool.execute(`
      SELECT COUNT(*) as recent 
      FROM registration_tbl 
      WHERE is_deleted = 0 
      AND created_datetime >= DATE(NOW() - INTERVAL 7 DAY)
    `);
    const recentRegistrations = recentCount[0]?.recent || 0;
    console.log(' Recent registrations:', recentRegistrations);

    // Get department-wise statistics
    const [departmentStats] = await promisePool.execute(`
      SELECT 
        d.department_name as title,
        COUNT(r.reg_id) as value,
        CASE 
          WHEN LOWER(d.department_name) LIKE '%admin%' THEN '#EC4899'
          WHEN LOWER(d.department_name) LIKE '%nursing%' THEN '#3B82F6'
          WHEN LOWER(d.department_name) LIKE '%dressing%' THEN '#F59E0B'
          WHEN LOWER(d.department_name) LIKE '%paramedical%' THEN '#10B981'
          WHEN LOWER(d.department_name) LIKE '%pathology%' THEN '#8B5CF6'
          WHEN LOWER(d.department_name) LIKE '%acupuncture%' OR LOWER(d.department_name) LIKE '%accupressure%' THEN '#06B6D4'
          WHEN LOWER(d.department_name) LIKE '%pharmacy%' THEN '#EC4899'
          WHEN LOWER(d.department_name) LIKE '%physiotherapy%' THEN '#3B82F6'
          WHEN LOWER(d.department_name) LIKE '%homeopathy%' THEN '#F59E0B'
          WHEN LOWER(d.department_name) LIKE '%ambulance%' THEN '#10B981'
          WHEN LOWER(d.department_name) LIKE '%registration%' THEN '#8B5CF6'
          WHEN LOWER(d.department_name) LIKE '%lab%' THEN '#06B6D4'
          ELSE '#6B7280'
        END as color
      FROM department_tbl d
      LEFT JOIN registration_tbl r ON d.id = r.department_id AND r.is_deleted = 0
      WHERE d.is_deleted = 0
      GROUP BY d.id, d.department_name
      ORDER BY COUNT(r.reg_id) DESC, d.department_name
    `);

    console.log(' Department stats fetched:', departmentStats.length, 'departments');

    res.json({
      success: true,
      data: {
        stats: departmentStats || [],
        totalUsers: totalUsers,
        recentRegistrations: recentRegistrations,
        lastUpdated: new Date().toISOString(),
        period: 'Current Data'
      }
    });

  } catch (error) {
    console.error(' Dashboard stats error:', {
      message: error.message,
      code: error.code,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user profile - Also add this if missing
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Fetching profile for user:', req.user.userId);

    const [users] = await promisePool.execute(`
      SELECT 
        r.reg_id, r.full_name, r.email, r.user_type, r.mobile_no, r.title,
        r.profile_img_path, r.created_datetime, r.dob, r.address,
        r.gender, r.total_exp, r.prev_sewa_perform, r.recom_by,
        q.qualification_name, d.department_name, s.state_name, c.city_name
      FROM registration_tbl r
      LEFT JOIN qualification_tbl q ON r.qualification_id = q.id AND q.is_deleted = 0
      LEFT JOIN department_tbl d ON r.department_id = d.id AND d.is_deleted = 0
      LEFT JOIN state_tbl s ON r.state_id = s.id AND s.is_deleted = 0
      LEFT JOIN city_tbl c ON r.city_id = c.id AND c.is_deleted = 0
      WHERE r.reg_id = ? AND r.is_deleted = 0
    `, [req.user.userId]);

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const user = users[0];

    // Format location
    let location = 'Not specified';
    if (user.city_name && user.state_name) {
      location = `${user.city_name}, ${user.state_name}`;
    } else if (user.state_name) {
      location = user.state_name;
    }

    // Calculate age
    let age = null;
    if (user.dob) {
      const birthDate = new Date(user.dob);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    console.log(' Profile fetched successfully for:', user.full_name);

    res.json({
      success: true,
      data: {
        id: user.reg_id,
        name: user.full_name,
        title: user.title || 'Mr/Ms',
        email: user.email,
        role: user.user_type === 'admin' ? 'Medical Administrator' : 'Medical Sewadar',
        qualification: user.qualification_name || 'Not specified',
        department: user.department_name || 'Not assigned',
        profileImage: user.profile_img_path || null,
        joinedDate: user.created_datetime,
        location: location,
        mobile: user.mobile_no,
        address: user.address || 'Not provided',
        age: age,
        gender: user.gender === 1 ? 'Male' : user.gender === 2 ? 'Female' : 'Other',
        experience: user.total_exp || 0,
        previousSewa: user.prev_sewa_perform || 'None',
        recommendedBy: user.recom_by || 'Not specified'
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});
// Get all users for admin dashboard (Fixed without stored procedure)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Only allow admin to view all users
    if (req.user.userType !== 'admin' && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    console.log('Admin fetching all users...');

    // Get query parameters for filtering/pagination
    const { 
      search = '', 
      department = '', 
      userType = '', 
      page = 1, 
      limit = 50 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build dynamic WHERE clause
    let whereConditions = ['r.is_deleted = 0'];
    let queryParams = [];

    if (search) {
      whereConditions.push('(r.full_name LIKE ? OR r.email LIKE ? OR r.mobile_no LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (department) {
      whereConditions.push('d.department_name = ?');
      queryParams.push(department);
    }

    if (userType) {
      whereConditions.push('r.user_type = ?');
      queryParams.push(userType);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get users with pagination
    const [users] = await promisePool.execute(`
      SELECT 
        r.reg_id, r.full_name, r.email, r.user_type, r.mobile_no,
        r.profile_img_path, r.created_datetime, r.dob, r.address, r.title,
        r.is_present, r.pass_entry, r.total_exp,
        q.qualification_name, d.department_name, s.state_name, c.city_name
      FROM registration_tbl r
      LEFT JOIN qualification_tbl q ON r.qualification_id = q.id AND q.is_deleted = 0
      LEFT JOIN department_tbl d ON r.department_id = d.id AND d.is_deleted = 0
      LEFT JOIN state_tbl s ON r.state_id = s.id AND s.is_deleted = 0
      LEFT JOIN city_tbl c ON r.city_id = c.id AND c.is_deleted = 0
      WHERE ${whereClause}
      ORDER BY r.created_datetime DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, parseInt(limit), offset]);

    // Get total count for pagination
    const [countResult] = await promisePool.execute(`
      SELECT COUNT(*) as total
      FROM registration_tbl r
      LEFT JOIN department_tbl d ON r.department_id = d.id
      WHERE ${whereClause}
    `, queryParams);

    const totalUsers = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    console.log(`Fetched ${users.length} users for admin`);

    res.json({
      success: true,
      data: users.map((user) => ({
        id: user.reg_id,
        name: user.full_name,
        title: user.title,
        email: user.email,
        role: user.user_type === 'admin' ? 'Administrator' : 'Medical Staff',
        department: user.department_name || 'Not assigned',
        qualification: user.qualification_name || 'Not specified',
        mobile: user.mobile_no,
        location: user.city_name && user.state_name ? `${user.city_name}, ${user.state_name}` : 'Not specified',
        joinedDate: user.created_datetime,
        isPresent: user.is_present === 1,
        hasPass: user.pass_entry === 1,
        experience: user.total_exp || 0,
        profileImage: user.profile_img_path || null
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalUsers: totalUsers,
        limit: parseInt(limit),
        hasNext: parseInt(page) < totalPages,
        hasPrevious: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update user profile (bonus endpoint)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobileNo,
      address,
      stateId,
      cityId,
      departmentId,
      qualificationId
    } = req.body;

    console.log('Updating profile for user:', req.user.userId);

    // Check if email is being changed and if it's already taken
    if (email) {
      const [existingUser] = await promisePool.execute(
        'SELECT reg_id FROM registration_tbl WHERE email = ? AND reg_id != ? AND is_deleted = 0',
        [email, req.user.userId]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email address is already taken by another user'
        });
      }
    }

    // Update user profile
    const [result] = await promisePool.execute(`
      UPDATE registration_tbl 
      SET 
        full_name = COALESCE(?, full_name),
        email = COALESCE(?, email),
        mobile_no = COALESCE(?, mobile_no),
        address = COALESCE(?, address),
        state_id = COALESCE(?, state_id),
        city_id = COALESCE(?, city_id),
        department_id = COALESCE(?, department_id),
        qualification_id = COALESCE(?, qualification_id),
        updated_datetime = NOW()
      WHERE reg_id = ? AND is_deleted = 0
    `, [
      fullName, email, mobileNo, address, 
      stateId, cityId, departmentId, qualificationId,
      req.user.userId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no changes made'
      });
    }

    console.log('Profile updated successfully for user:', req.user.userId);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
