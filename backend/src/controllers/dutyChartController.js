const dutyChartService = require("../services/dutyChartService");
const { sendResponse } = require("../utils/response");
const { asyncHandler } = require("../utils/errorHandler");

exports.listCharts = asyncHandler(async (req, res) => {
  const items = await dutyChartService.listCharts({
    department: req.query.department,
    year: req.query.year,
  });

  sendResponse(res, 200, true, "Duty charts fetched successfully", { items, count: items.length });
});

// New: List all duty entries (flattened with chart context)
exports.listEntries = asyncHandler(async (req, res) => {
  const items = await dutyChartService.listEntries({
    department: req.query.department,
    year: req.query.year,
  });

  sendResponse(res, 200, true, "Duty entries fetched successfully", { items, count: items.length });
});

exports.getChartById = asyncHandler(async (req, res) => {
  const chart = await dutyChartService.getChartById(req.params.chartId);

  if (!chart) {
    return sendResponse(res, 404, false, "Duty chart not found");
  }

  sendResponse(res, 200, true, "Duty chart fetched successfully", chart);
});

exports.getChartByDepartmentYear = asyncHandler(async (req, res) => {
  const chart = await dutyChartService.getChartByDepartmentYear(
    req.params.department,
    req.params.year
  );

  if (!chart) {
    return sendResponse(res, 404, false, "Duty chart not found");
  }

  sendResponse(res, 200, true, "Duty chart fetched successfully", chart);
});

// New: Create a chart without entries
exports.createChart = asyncHandler(async (req, res) => {
  const chart = await dutyChartService.createChart(req.body);
  sendResponse(res, 201, true, "Duty chart created successfully", chart);
});

// New: Update a chart's details
exports.updateChart = asyncHandler(async (req, res) => {
  const chart = await dutyChartService.updateChart(req.params.chartId, req.body);
  if (!chart) {
    return sendResponse(res, 404, false, "Duty chart not found");
  }
  sendResponse(res, 200, true, "Duty chart updated successfully", chart);
});

// New: Delete a chart and all its entries
exports.deleteChart = asyncHandler(async (req, res) => {
  await dutyChartService.deleteChart(req.params.chartId);
  sendResponse(res, 200, true, "Duty chart deleted successfully");
});

exports.createEntry = asyncHandler(async (req, res) => {
  const result = await dutyChartService.createEntry(req.body);
  sendResponse(res, 201, true, "Duty chart entry saved successfully", result);
});

exports.updateEntry = asyncHandler(async (req, res) => {
  const entry = await dutyChartService.updateEntry(req.params.chartId, req.params.entryId, req.body);
  sendResponse(res, 200, true, "Duty chart entry updated successfully", entry);
});

exports.deleteEntry = asyncHandler(async (req, res) => {
  await dutyChartService.deleteEntry(req.params.chartId, req.params.entryId);
  sendResponse(res, 200, true, "Duty chart entry deleted successfully");
});

exports.exportChart = asyncHandler(async (req, res) => {
  const result = await dutyChartService.exportChart(req.params.chartId);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
  res.status(200).send(result.content);
});

exports.getDutyDepartments = asyncHandler(async (req, res) => {
  const items = await dutyChartService.getDutyDepartments(req.query.search || "");
  sendResponse(res, 200, true, "Departments fetched successfully from sp_department_master", {
    items,
    count: items.length,
  });
});