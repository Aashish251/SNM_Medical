const patientService = require("../services/patientService");
const { sendResponse } = require("../utils/response");
const { asyncHandler } = require("../utils/errorHandler");

exports.createPatientRegistration = asyncHandler(async (req, res) => {
  const record = await patientService.createPatientRegistration(req.body);
  sendResponse(res, 201, true, "Patient registration saved successfully", record);
});

exports.listPatientRegistrations = asyncHandler(async (req, res) => {
  const items = await patientService.listPatientRegistrations();
  sendResponse(res, 200, true, "Patient registrations fetched successfully", { items, count: items.length });
});

exports.getPatientRegistrationById = asyncHandler(async (req, res) => {
  const item = await patientService.getPatientRegistrationById(req.params.id);

  if (!item) {
    return sendResponse(res, 404, false, "Patient registration not found");
  }

  sendResponse(res, 200, true, "Patient registration fetched successfully", item);
});
