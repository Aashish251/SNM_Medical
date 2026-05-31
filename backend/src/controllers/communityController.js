const communityService = require("../services/communityService");
const { sendResponse } = require("../utils/response");
const { asyncHandler } = require("../utils/errorHandler");

exports.createBloodDrive = asyncHandler(async (req, res) => {
  const record = await communityService.createBloodDrive(req.body);
  sendResponse(res, 201, true, "Blood drive saved successfully", record);
});

exports.listBloodDrives = asyncHandler(async (req, res) => {
  const items = await communityService.listBloodDrives();
  sendResponse(res, 200, true, "Blood drives fetched successfully", { items, count: items.length });
});

exports.getBloodDriveById = asyncHandler(async (req, res) => {
  const item = await communityService.getBloodDriveById(req.params.id);

  if (!item) {
    return sendResponse(res, 404, false, "Blood drive not found");
  }

  sendResponse(res, 200, true, "Blood drive fetched successfully", item);
});

exports.createHealthDrive = asyncHandler(async (req, res) => {
  const record = await communityService.createHealthDrive(req.body);
  sendResponse(res, 201, true, "Health drive saved successfully", record);
});

exports.listHealthDrives = asyncHandler(async (req, res) => {
  const items = await communityService.listHealthDrives();
  sendResponse(res, 200, true, "Health drives fetched successfully", { items, count: items.length });
});

exports.getHealthDriveById = asyncHandler(async (req, res) => {
  const item = await communityService.getHealthDriveById(req.params.id);

  if (!item) {
    return sendResponse(res, 404, false, "Health drive not found");
  }

  sendResponse(res, 200, true, "Health drive fetched successfully", item);
});

exports.checkEligibility = asyncHandler(async (req, res) => {
  const result = await communityService.checkBloodDonationEligibility({
    ...req.body,
    driveId: req.params.id || req.body.driveId,
  });

  sendResponse(
    res,
    200,
    true,
    result.eligible ? "Eligible to Donate" : "Not Eligible",
    result
  );
});
