const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { promisePool } = require('../config/database');

// Get dashboard statistics using stored procedure - FIXED
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    console.log(' Fetching dashboard statistics using stored procedure for user:', req.user?.userId);
 
    const [statsResults] = await promisePool.execute('CALL sp_get_dashboard_stats()');

    const totalUsers = statsResults[0]?.[0]?.total_users || 0;
    const recentRegistrations = statsResults[1]?.recent_registrations || 0;  
    const departmentStats = statsResults[2] || [];

    console.log('📋 Dashboard stats fetched successfully using stored procedure');

    res.json({
      success: true,
      data: {
        stats: departmentStats,
        totalUsers: totalUsers,
        recentRegistrations: recentRegistrations,
        lastUpdated: new Date().toISOString(),
        period: 'Current Data'
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user profile using stored procedure - FIXED
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    console.log(' Fetching profile using stored procedure for user:', req.user.userId);

    const [profileResults] = await promisePool.execute(
      'CALL sp_get_user_profile_complete(?)',
      [req.user.userId]
    );

    const users = profileResults[0] || [];
    
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

    console.log('Profile fetched successfully using stored procedure for:', user.full_name);
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

// Get all users for admin dashboard using stored procedures - FIXED
router.get('/users', authenticateToken, async (req, res) => {
  try {
  
    if (req.user.userType !== 'admin' && req.user.role !== 'Admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    console.log(' Admin fetching all users using stored procedures...');

    // Get query parameters for filtering/pagination
    const { 
      search = '', 
      department = '', 
      userType = '', 
      page = 1, 
      limit = 50 
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Use stored procedures for both data and count
    const [
      [usersResult],
      [countResult]
    ] = await Promise.all([
      promisePool.execute(
        'CALL sp_get_users_filtered(?, ?, ?, ?, ?)',
        [search || null, department || null, userType || null, parseInt(limit), offset]
      ),
      promisePool.execute(
        'CALL sp_get_users_count_filtered(?, ?, ?)',
        [search || null, department || null, userType || null]
      )
    ]);

    const users = usersResult[0] || [];
   
    const totalUsers = countResult?.total || 0;
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

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

// Update user profile using stored procedure - FIXED
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

    // Check if email is being changed and if it's already taken
    if (email) {
      const [emailCheckResult] = await promisePool.execute(
        'CALL sp_check_email_for_update(?, ?)',
        [email, req.user.userId]
      );

      if (emailCheckResult[0]?.[0]?.email_exists > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email address is already taken by another user'
        });
      }
    }

    // Update user profile using stored procedure
    const [updateResult] = await promisePool.execute(
      'CALL sp_update_user_profile(?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        req.user.userId,
        fullName || null,
        email || null,
        mobileNo || null,
        address || null,
        stateId || null,
        cityId || null,
        departmentId || null,
        qualificationId || null
      ]
    );

    const affectedRows = updateResult[0]?.affected_rows || 0;

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no changes made'
      });
    }


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

// Update user presence status using stored procedure (for admin) - FIXED
router.put('/users/:userId/presence', authenticateToken, async (req, res) => {
  try {
    // Only allow admin to update presence
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const { userId } = req.params;
    const { isPresent, passEntry } = req.body;

    console.log(`Admin updating presence using stored procedure for user ${userId}`);

    const [updateResult] = await promisePool.execute(
      'CALL sp_update_user_presence(?, ?, ?)',
      [userId, isPresent || null, passEntry || null]
    );

    
    const affectedRows = updateResult[0]?.affected_rows || 0;

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      message: 'User presence status updated successfully'
    });

  } catch (error) {
    console.error('Presence update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update presence status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get dashboard summary for admin using stored procedure - FIXED
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    console.log('Fetching admin dashboard summary using stored procedure...');

    const [summaryResult] = await promisePool.execute('CALL sp_get_admin_summary()');
  
    const summary = summaryResult[0] || {};

    console.log('Admin dashboard summary fetched successfully using stored procedure');

    res.json({
      success: true,
      data: {
        totalUsers: summary.totalUsers || 0,
        recentRegistrations: summary.recentRegistrations || 0,
        presentUsers: summary.presentUsers || 0,
        usersWithPass: summary.usersWithPass || 0,
        adminUsers: summary.adminUsers || 0,
        medicalStaff: summary.medicalStaff || 0,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Admin summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin summary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
