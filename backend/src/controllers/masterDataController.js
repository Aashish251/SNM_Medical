const masterDataService = require("../services/masterDataService");
const { sendResponse } = require("../utils/response");
const { asyncHandler } = require("../utils/errorHandler");

exports.listModules = asyncHandler(async (req, res) => {
  const items = await masterDataService.listModules();
  sendResponse(res, 200, true, "Master modules fetched successfully", { items });
});

exports.listItems = asyncHandler(async (req, res) => {
  const items = await masterDataService.listItems(req.params.module, req.query.search || "");
  sendResponse(res, 200, true, "Master records fetched successfully", { items, count: items.length });
});

exports.createItem = asyncHandler(async (req, res) => {
  const item = await masterDataService.createItem(req.params.module, req.body);
  sendResponse(res, 201, true, "Master record created successfully", item);
});

exports.updateItem = asyncHandler(async (req, res) => {
  const item = await masterDataService.updateItem(req.params.module, req.params.id, req.body);
  sendResponse(res, 200, true, "Master record updated successfully", item);
});

exports.deleteItem = asyncHandler(async (req, res) => {
  await masterDataService.deleteItem(req.params.module, req.params.id, req.body?.updatedBy || 1);
  sendResponse(res, 200, true, "Master record deleted successfully");
});
