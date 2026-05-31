const express = require("express");
const dutyChartController = require("../controllers/dutyChartController");

const router = express.Router();

router.get("/filter", dutyChartController.listCharts);
router.get("/charts", dutyChartController.listCharts);
router.get("/charts/:chartId", dutyChartController.getChartById);
router.get("/charts/:chartId/export", dutyChartController.exportChart);
router.post("/entries", dutyChartController.createEntry);
router.put("/charts/:chartId/entries/:entryId", dutyChartController.updateEntry);
router.delete("/charts/:chartId/entries/:entryId", dutyChartController.deleteEntry);

module.exports = router;
