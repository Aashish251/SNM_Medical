const express = require("express");
const dutyChartController = require("../controllers/dutyChartController");

const router = express.Router();

router.get("/filter",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'Filter duty charts'
     #swagger.description = 'List duty chart summaries, optionally filtered by department and year.'
     #swagger.parameters['department'] = { in: 'query', type: 'string', required: false, example: 'NURSES' }
     #swagger.parameters['year'] = { in: 'query', type: 'integer', required: false, example: 2026 }
     #swagger.responses[200] = { description: 'Duty charts fetched successfully' }
     #swagger.responses[500] = { description: 'Failed to fetch duty charts' }
  */
  dutyChartController.listCharts
);

router.get("/charts",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'List duty charts'
     #swagger.description = 'List duty chart summaries, optionally filtered by department and year.'
     #swagger.parameters['department'] = { in: 'query', type: 'string', required: false, example: 'NURSES' }
     #swagger.parameters['year'] = { in: 'query', type: 'integer', required: false, example: 2026 }
     #swagger.responses[200] = { description: 'Duty charts fetched successfully' }
     #swagger.responses[500] = { description: 'Failed to fetch duty charts' }
  */
  dutyChartController.listCharts
);

router.get("/charts/by-key/:department/:year",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'Get duty chart by department and year'
     #swagger.description = 'Retrieve the duty chart entries for an HTML dropdown key such as NURSES_2026.'
     #swagger.parameters['department'] = { in: 'path', type: 'string', required: true, example: 'NURSES' }
     #swagger.parameters['year'] = { in: 'path', type: 'integer', required: true, example: 2026 }
     #swagger.responses[200] = { description: 'Duty chart fetched successfully' }
     #swagger.responses[404] = { description: 'Duty chart not found' }
     #swagger.responses[500] = { description: 'Failed to fetch duty chart' }
  */
  dutyChartController.getChartByDepartmentYear
);

router.get("/charts/:chartId",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'Get duty chart by ID'
     #swagger.description = 'Retrieve one duty chart with all entries.'
     #swagger.parameters['chartId'] = { in: 'path', type: 'integer', required: true, example: 1 }
     #swagger.responses[200] = { description: 'Duty chart fetched successfully' }
     #swagger.responses[404] = { description: 'Duty chart not found' }
     #swagger.responses[500] = { description: 'Failed to fetch duty chart' }
  */
  dutyChartController.getChartById
);

router.get("/charts/:chartId/export",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'Export duty chart'
     #swagger.description = 'Export one duty chart as CSV.'
     #swagger.produces = ['text/csv']
     #swagger.parameters['chartId'] = { in: 'path', type: 'integer', required: true, example: 1 }
     #swagger.responses[200] = { description: 'CSV file generated successfully' }
     #swagger.responses[404] = { description: 'Duty chart not found' }
     #swagger.responses[500] = { description: 'Failed to export duty chart' }
  */
  dutyChartController.exportChart
);

router.post("/entries",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'Create duty chart entry'
     #swagger.description = 'Create a duty chart if needed, then append a duty entry.'
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         $title: '58TH MAHARASHTRA NIRANKARI SANT SAMAGAM',
         $department: 'NURSES',
         $date: '2026-01-01',
         $name: 'Asha Sharma',
         $contact: '9876543210',
         $shift: 'Morning (8.00 AM to 4.00 PM)'
       }
     }
     #swagger.responses[201] = { description: 'Duty chart entry saved successfully' }
     #swagger.responses[400] = { description: 'Invalid duty chart data' }
     #swagger.responses[500] = { description: 'Failed to save duty chart entry' }
  */
  dutyChartController.createEntry
);

router.put("/charts/:chartId/entries/:entryId",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'Update duty chart entry'
     #swagger.description = 'Update name, contact number, and shift for a duty chart entry.'
     #swagger.parameters['chartId'] = { in: 'path', type: 'integer', required: true, example: 1 }
     #swagger.parameters['entryId'] = { in: 'path', type: 'integer', required: true, example: 1 }
     #swagger.parameters['body'] = {
       in: 'body',
       required: true,
       schema: {
         $name: 'Asha Sharma',
         $contact: '9876543210',
         $shift: 'Evening (4.00 PM to 10.00 PM)'
       }
     }
     #swagger.responses[200] = { description: 'Duty chart entry updated successfully' }
     #swagger.responses[400] = { description: 'Invalid duty chart data' }
     #swagger.responses[404] = { description: 'Duty chart or entry not found' }
     #swagger.responses[500] = { description: 'Failed to update duty chart entry' }
  */
  dutyChartController.updateEntry
);

router.delete("/charts/:chartId/entries/:entryId",
  /* #swagger.tags = ['DutyChart']
     #swagger.summary = 'Delete duty chart entry'
     #swagger.description = 'Delete one entry from a duty chart.'
     #swagger.produces = ['application/json']
     #swagger.parameters['chartId'] = { in: 'path', type: 'integer', required: true, example: 1 }
     #swagger.parameters['entryId'] = { in: 'path', type: 'integer', required: true, example: 1 }
     #swagger.responses[200] = { description: 'Duty chart entry deleted successfully' }
     #swagger.responses[404] = { description: 'Duty chart or entry not found' }
     #swagger.responses[500] = { description: 'Failed to delete duty chart entry' }
  */
  dutyChartController.deleteEntry
);

module.exports = router;
