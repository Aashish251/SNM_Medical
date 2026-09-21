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

  // Log incoming request
  logger.info("Incoming Request", {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    body: req.method !== "GET" ? (JSON.stringify(req.body) || "{}").substring(0, 200) : "N/A",
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
