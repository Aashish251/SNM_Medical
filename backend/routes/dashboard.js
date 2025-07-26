const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { promisePool } = require('../config/database');

// Get dashboard statistics from actual database
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Get department-wise statistics
    const [departmentStats] = await promisePool.execute(`
      SELECT 
        d.department_name as title,
        COUNT(r.reg_id) as value,
        CASE 
          WHEN d.department_name = 'Admin' THEN '#EC4899'
          WHEN d.department_name = 'Nursing' THEN '#3B82F6'
          WHEN d.department_name = 'Dressing' THEN '#F59E0B'
          WHEN d.department_name = 'Paramedical' THEN '#10B981'
          WHEN d.department_name = 'Pathology' THEN '#8B5CF6'
          WHEN d.department_name = 'Accupressure' THEN '#06B6D4'
          WHEN d.department_name = 'Pharmacy' THEN '#EC4899'
          WHEN d.department_name = 'Physiotherapy' THEN '#3B82F6'
          WHEN d.department_name = 'Homeopathy' THEN '#F59E0B'
          WHEN d.department_name = 'Ambulance' THEN '#10B981'
          WHEN d.department_name = 'Registration' THEN '#8B5CF6'
          WHEN d.department_name = 'Lab' THEN '#06B6D4'
          ELSE '#6B7280'
        END as color
      FROM department_tbl d
      LEFT JOIN registration_tbl r ON d.id = r.department_id AND r.is_deleted = 0
      WHERE d.is_deleted = 0
      GROUP BY d.id, d.department_name
      ORDER BY d.department_name
    `);

    res.json({
      success: true,
      data: {
        stats: departmentStats,
        lastUpdated: new Date().toISOString(),
        period: 'Current Data'
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
});

// Get user profile from database
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Query user data from registration table
    const [users] = await promisePool.execute(`
      SELECT 
        r.reg_id, r.full_name, r.email, r.user_type, r.mobile_no,
        r.profile_img_path, r.created_datetime, r.dob, r.address,
        q.qualification_name, d.department_name, s.state_name, c.city_name
      FROM registration_tbl r
      LEFT JOIN qualification_tbl q ON r.qualification_id = q.id
      LEFT JOIN department_tbl d ON r.department_id = d.id
      LEFT JOIN state_tbl s ON r.state_id = s.id
      LEFT JOIN city_tbl c ON r.city_id = c.id
      WHERE r.reg_id = ? AND r.is_deleted = 0
    `, [req.user.userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        id: user.reg_id,
        name: user.full_name,
        email: user.email,
        role: user.user_type === 'admin' ? 'Medical Administrator' : 'Medical Sewadar',
        qualification: user.qualification_name || 'Not specified',
        department: user.department_name || 'Not assigned',
        profileImage: user.profile_img_path,
        joinedDate: user.created_datetime,
        location: `${user.city_name}, ${user.state_name}`,
        mobile: user.mobile_no,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Get all users for admin dashboard
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Only allow admin to view all users
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Use stored procedure to get user profiles
    const [results] = await promisePool.execute(
      'CALL sp_get_user_profiles(?, ?, ?, ?, ?, ?, ?, ?)',
      ['', null, null, null, null, null, null, null] // Empty search = get all
    );

    const users = results[0] || [];

    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
