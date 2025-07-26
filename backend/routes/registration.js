const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/database');

// Get dropdown data for registration form
router.get('/dropdown-data', async (req, res) => {
  try {
    const [states] = await promisePool.execute('CALL sp_get_state_details(0)');
    const [departments] = await promisePool.execute('CALL sp_get_department_by_id(0)');
    const [qualifications] = await promisePool.execute('CALL sp_get_qualification_by_id(0)');
    const [availableDays] = await promisePool.execute('CALL sp_get_available_day_by_id(0)');
    const [shiftTimes] = await promisePool.execute('CALL sp_get_shifttime_by_id(0)');
    const [sewaLocations] = await promisePool.execute('CALL sp_get_sewalocation_by_id(0)');

    res.json({
      success: true,
      data: {
        states: states[0] || [],
        departments: departments[0] || [],
        qualifications: qualifications[0] || [],
        availableDays: availableDays[0] || [],
        shiftTimes: shiftTimes[0] || [],
        sewaLocations: sewaLocations[0] || []
      }
    });
  } catch (error) {
    console.error('Dropdown data error:', error);
    res.status(500).json({ message: 'Failed to fetch dropdown data' });
  }
});

// Get cities by state
router.get('/cities/:stateId', async (req, res) => {
  try {
    const { stateId } = req.params;
    const [cities] = await promisePool.execute('CALL sp_get_city_details(?)', [stateId]);

    res.json({
      success: true,
      data: cities[0] || []
    });
  } catch (error) {
    console.error('Cities fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
});

module.exports = router;
