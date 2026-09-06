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
