const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

/**
 * Request Logging & Tracking Middleware
 * Adds unique request ID and logs all requests
 */
const requestLogger = (req, res, next) => {
  // Generate unique request ID
  req.id = req.headers["x-request-id"] || uuidv4();

  // Store start time for performance tracking
  req.startTime = Date.now();

  // Sanitize request body for logging (mask sensitive fields)
  const sanitizeBody = (body) => {
    if (!body || typeof body !== "object") return body;
    const sensitiveFields = ["password", "newPassword", "confirmPassword", "currentPassword", "token", "authorization"];
    const sanitized = { ...body };
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = "***MASKED***";
      }
    }
    return sanitized;
  };
  const serializedBody = JSON.stringify(sanitizeBody(req.body) ?? {});

  // Log incoming request
  logger.info("Incoming Request", {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    body: req.method !== "GET" ? serializedBody.substring(0, 200) : "N/A",
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - req.startTime;

    logger.info("Response Sent", {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success: data?.success,
    });

    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;
