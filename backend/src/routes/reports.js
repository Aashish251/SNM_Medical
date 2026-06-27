const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const reportService = require('../services/reportService');

// Daily reports endpoint
router.get('/daily',
  /* #swagger.tags = ['Reports']
     #swagger.summary = 'Get daily reports'
     #swagger.description = 'Retrieve a single-date department-by-location daily report.'
     #swagger.parameters['date'] = {
       in: 'query',
       type: 'string',
       required: true,
       description: 'Report date in YYYY-MM-DD format'
     }
     #swagger.parameters['title'] = { in: 'query', type: 'string', required: false, description: 'Samagam/report title' }
     #swagger.parameters['departments'] = {
       in: 'query',
       type: 'string',
       required: false,
       description: 'Comma-separated department names. If omitted, default DailyReport departments are used.'
     }
     #swagger.parameters['locations'] = {
       in: 'query',
       type: 'string',
       required: false,
       description: 'Comma-separated location names. If omitted, default DailyReport locations are used.'
     }
     #swagger.parameters['includeEmpty'] = { in: 'query', type: 'boolean', required: false, description: 'Set true to include zero-value department rows' }
     #swagger.responses[200] = { description: 'Daily reports retrieved successfully' }
     #swagger.responses[400] = { description: 'Invalid report query' }
     #swagger.responses[500] = { description: 'Daily reports failed' }
  */
  async (req, res) => {
    try {
      const data = await reportService.getDailyReport(req.query);
      res.json({
        success: true,
        message: 'Daily reports retrieved successfully',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Daily reports error', { error: error.message });
      const status = /date|required/i.test(error.message) ? 400 : 500;
      res.status(status).json({
        success: false,
        message: 'Daily reports failed',
        error: error.message
      });
    }
  }
);

// Registration reports endpoint
router.get('/registration',
  /* #swagger.tags = ['Reports']
     #swagger.summary = 'Get registration reports'
     #swagger.description = 'Retrieve department-wise registration counts for up to three report dates.'
     #swagger.parameters['dates'] = {
       in: 'query',
       type: 'string',
       required: false,
       description: 'Comma-separated report dates in YYYY-MM-DD format. Example: 2026-06-01,2026-06-02,2026-06-03'
     }
     #swagger.parameters['date1'] = { in: 'query', type: 'string', required: false, description: 'First report date in YYYY-MM-DD format' }
     #swagger.parameters['date2'] = { in: 'query', type: 'string', required: false, description: 'Second report date in YYYY-MM-DD format' }
     #swagger.parameters['date3'] = { in: 'query', type: 'string', required: false, description: 'Third report date in YYYY-MM-DD format' }
     #swagger.parameters['title'] = { in: 'query', type: 'string', required: false, description: 'Report title' }
     #swagger.parameters['includeEmpty'] = { in: 'query', type: 'boolean', required: false, description: 'Set true to include departments with zero registrations' }
     #swagger.responses[200] = { description: 'Registration reports retrieved successfully' }
     #swagger.responses[400] = { description: 'Invalid report query' }
     #swagger.responses[500] = { description: 'Registration reports failed' }
  */
  async (req, res) => {
    try {
      const data = await reportService.getRegistrationReport(req.query);
      res.json({
        success: true,
        message: 'Registration reports retrieved successfully',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Registration reports error', { error: error.message });
      const status = /date|required/i.test(error.message) ? 400 : 500;
      res.status(status).json({
        success: false,
        message: 'Registration reports failed',
        error: error.message
      });
    }
  }
);

// Master reports endpoint
router.get('/master',
  /* #swagger.tags = ['Reports']
     #swagger.summary = 'Get master reports'
     #swagger.description = 'Retrieve date-wise and location-wise OPD/IPD report data.'
     #swagger.parameters['dates'] = {
       in: 'query',
       type: 'string',
       required: false,
       description: 'Comma-separated report dates in YYYY-MM-DD format. If omitted, dates are derived from patient registrations.'
     }
     #swagger.parameters['date1'] = { in: 'query', type: 'string', required: false, description: 'First report date in YYYY-MM-DD format' }
     #swagger.parameters['date2'] = { in: 'query', type: 'string', required: false, description: 'Second report date in YYYY-MM-DD format' }
     #swagger.parameters['date3'] = { in: 'query', type: 'string', required: false, description: 'Third report date in YYYY-MM-DD format' }
     #swagger.parameters['locations'] = {
       in: 'query',
       type: 'string',
       required: false,
       description: 'Comma-separated location names. Example: Dispensary 1,Langar 1'
     }
     #swagger.parameters['title'] = { in: 'query', type: 'string', required: false, description: 'Report title' }
     #swagger.parameters['includeEmpty'] = { in: 'query', type: 'boolean', required: false, description: 'Set true to include zero-value rows/cards' }
     #swagger.responses[200] = { description: 'Master reports retrieved successfully' }
     #swagger.responses[400] = { description: 'Invalid report query' }
     #swagger.responses[500] = { description: 'Master reports failed' }
  */
  async (req, res) => {
    try {
      const data = await reportService.getMasterReport(req.query);
      res.json({
        success: true,
        message: 'Master reports retrieved successfully',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Master reports error', { error: error.message });
      const status = /date|required/i.test(error.message) ? 400 : 500;
      res.status(status).json({
        success: false,
        message: 'Master reports failed',
        error: error.message
      });
    }
  }
);

module.exports = router;
