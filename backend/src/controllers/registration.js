const registrationService = require('../services/registration');
const { sendResponse, sendSuccess, sendError } = require('../utils/response');
const logger = require("../utils/logger");
const { uploadFileToLocal } = require('../utils/filePathHelper');

/**
 * Uploads user files (profile pic, certificate) concurrently
 */
const uploadRegistrationFiles = async (files = {}) => {
  const [profileImagePath, certificatePath] = await Promise.all([
    files?.profilePic?.[0]
      ? uploadFileToLocal(files.profilePic[0], 'profile')
      : Promise.resolve(null),
    files?.certificate?.[0]
      ? uploadFileToLocal(files.certificate[0], 'certificates')
      : Promise.resolve(null),
  ]);

  if (profileImagePath) logger.info("Profile image uploaded", { path: profileImagePath });
  if (certificatePath) logger.info("Certificate uploaded", { path: certificatePath });

  return { profileImagePath, certificatePath };
};

exports.getDropdownData = async (req, res) => {
  try {
    const data = await registrationService.getDropdownData();
    sendSuccess(res, 'Dropdown data fetched successfully', data);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

exports.getCities = async (req, res) => {
  const { stateId } = req.params;
  if (!stateId || isNaN(stateId) || Number(stateId) <= 0) {
    return sendResponse(res, 400, false, 'Valid state ID is required');
  }

  try {
    const cities = await registrationService.getCitiesByState(stateId);
    const message = cities.length ? 'Cities fetched successfully' : 'No cities found';
    sendSuccess(res, message, { cities, count: cities.length });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendResponse(res, 400, false, 'Email is required');

  try {
    const exists = await registrationService.checkEmailExists(email);
    const message = exists ? 'Email already exists' : 'Email available';
    sendSuccess(res, message, { exists });
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

exports.checkAvailability = async (req, res) => {
  const email = String(req.body?.email || "").trim();
  const mobileNo = String(req.body?.mobileNo || "").trim();
  if (!email && !mobileNo) return sendResponse(res, 400, false, "Email or mobile number is required");

  try {
    const availability = await registrationService.checkRegistrationAvailability({ email, mobileNo });
    const messages = [];
    if (availability.emailExists) messages.push("Email already exists");
    if (availability.mobileExists) messages.push("Phone number already exists");
    sendSuccess(res, messages.join(". ") || "Email and phone number are available", availability);
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const files = req.files || {};
    const userData = req.body || {};

    logger.info("Registration request received", {
      bodyKeys: Object.keys(userData),
      files: Object.keys(files),
      contentType: req.headers["content-type"],
    });

    if (!userData || Object.keys(userData).length === 0) {
      return sendResponse(res, 400, false, "No registration data provided");
    }

    let filePaths = {};
    try {
      filePaths = await uploadRegistrationFiles(files);
    } catch (uploadError) {
      logger.error("File upload failed", { error: uploadError.message });
      return sendResponse(res, 400, false, `File upload failed: ${uploadError.message}`);
    }

    const result = await registrationService.createUser(userData, filePaths);
    return sendSuccess(res, "User registered successfully!", result, 201);
  } catch (error) {
    next(error);
  }
};

exports.uploadProfileImage = async (req, res, next) => {
  if (!req.file) {
    return sendResponse(res, 400, false, 'No profile image uploaded');
  }

  try {
    const filePath = await uploadFileToLocal(req.file, 'profile');
    return sendSuccess(res, 'Profile image uploaded successfully', { filePath });
  } catch (error) {
    next(error);
  }
};

exports.uploadCertificate = async (req, res, next) => {
  if (!req.file) {
    return sendResponse(res, 400, false, 'No certificate uploaded');
  }

  try {
    const filePath = await uploadFileToLocal(req.file, 'certificates');
    return sendSuccess(res, 'Certificate uploaded successfully', { filePath });
  } catch (error) {
    next(error);
  }
};

