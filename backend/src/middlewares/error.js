const multer = require("multer");
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });

  // Multer-specific errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Custom validation / logic errors
  if (err.message) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Fallback
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
