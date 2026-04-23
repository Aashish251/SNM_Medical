const multer = require("multer");
const logger = require("../utils/logger");

/**
 * Global Error Handler Middleware
 * Catches all errors and logs them appropriately
 */
module.exports = (err, req, res, next) => {
  const errorId = req.id || `error-${Date.now()}`;
  
  // Log error with full context
  const errorMeta = {
    errorId,
    method: req.method,
    path: req.path,
    statusCode: err.status || 500,
    ip: req.ip,
    userId: req.userId || "anonymous",
    userAgent: req.get("user-agent"),
    stack: err.stack,
    body: req.body ? JSON.stringify(req.body).substring(0, 500) : "N/A",
  };

  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    logger.warn(`Multer Upload Error: ${err.message}`, {
      ...errorMeta,
      field: err.field,
      code: err.code,
    });

    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
      errorId,
    });
  }

  // Validation errors
  if (err.name === "ValidationError") {
    logger.warn(`Validation Error: ${err.message}`, errorMeta);

    return res.status(400).json({
      success: false,
      message: `Validation failed: ${err.message}`,
      errorId,
      details: process.env.NODE_ENV === "development" ? err.details : undefined,
    });
  }

  // JWT/Authentication errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    logger.warn(`Authentication Error: ${err.message}`, {
      ...errorMeta,
      errorType: err.name,
    });

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      errorId,
    });
  }

  // Database errors
  if (err.code && (err.code.includes("ER_") || err.errno)) {
    logger.error(`Database Error: ${err.message}`, {
      ...errorMeta,
      code: err.code,
      errno: err.errno,
      sqlMessage: err.sqlMessage,
    });

    // Don't expose database details to client
    return res.status(500).json({
      success: false,
      message: "Database operation failed",
      errorId,
    });
  }

  // Custom application errors
  if (err.isAppError) {
    const statusCode = err.statusCode || 500;
    const logLevel = statusCode >= 500 ? "error" : "warn";

    logger[logLevel](`Application Error: ${err.message}`, {
      ...errorMeta,
      statusCode,
    });

    return res.status(statusCode).json({
      success: false,
      message: err.message,
      errorId,
    });
  }

  // Generic/unexpected errors
  logger.error(`Unhandled Error: ${err.message}`, errorMeta);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    errorId,
  });
};
