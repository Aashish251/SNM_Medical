const { createLogger, format, transports } = require("winston");
require("dotenv").config();

/**
 * Initialize Sentry (if credentials provided)
 */
const initializeSentry = () => {
  if (!process.env.SENTRY_DSN) {
    console.warn("⚠️ Sentry DSN not configured. Sentry error tracking disabled.");
    return null;
  }

  try {
    const Sentry = require("@sentry/node");
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || "development",
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || (process.env.NODE_ENV === "production" ? 0.1 : 1.0),
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
      ],
    });
    console.log("✅ Sentry initialized for error tracking");
    return Sentry;
  } catch (error) {
    console.error("Failed to initialize Sentry:", error.message);
    return null;
  }
};

const Sentry = initializeSentry();

/**
 * Custom Winston Logger with Sentry and BetterStack integration
 */
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: {
    service: "snm-medical-api",
    environment: process.env.NODE_ENV || "development",
  },
  transports: [
    // Console transport
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, ...meta }) => {
          let metaStr = "";
          if (Object.keys(meta).length > 0) {
            metaStr = JSON.stringify(meta, null, 2);
          }
          return `${timestamp} [${level}]: ${message} ${metaStr}`;
        })
      ),
    }),

    // Error log file (local)
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // Combined log file (local)
    new transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),

    // Info log file (local)
    new transports.File({
      filename: "logs/info.log",
      level: "info",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: "logs/exceptions.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: "logs/rejections.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

/**
 * Helper function to send logs to BetterStack
 * BetterStack accepts logs via HTTP endpoint
 */
const sendToBeaterStack = async (logData) => {
  if (!process.env.BETTERSTACK_SOURCE_TOKEN) {
    return; // BetterStack not configured
  }

  try {
    const payload = {
      dt: new Date().toISOString(),
      level: logData.level,
      message: logData.message,
      ...logData.meta,
    };

    // Use dynamic import for fetch at runtime
    const response = await fetch("https://in.betterstack.com/api/v1/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BETTERSTACK_SOURCE_TOKEN}`,
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      // Silently fail - don't disrupt main app if BetterStack is down
      if (process.env.NODE_ENV === "development") {
        console.error("BetterStack logging failed:", err.message);
      }
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error sending to BetterStack:", err.message);
    }
  }
};

/**
 * Enhanced logging methods
 */
const enhancedLogger = {
  info: (message, meta = {}) => {
    logger.info(message, meta);
    sendToBeaterStack({ level: "info", message, meta });
  },

  warn: (message, meta = {}) => {
    logger.warn(message, meta);
    sendToBeaterStack({ level: "warn", message, meta });
  },

  error: (message, meta = {}) => {
    logger.error(message, meta);
    sendToBeaterStack({ level: "error", message, meta });

    // Also send to Sentry
    if (Sentry) {
      const error = meta.error instanceof Error ? meta.error : new Error(message);
      Sentry.captureException(error, {
        level: "error",
        contexts: {
          additional: meta,
        },
      });
    }
  },

  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },

  // Log with request context
  logRequest: (req, message, level = "info") => {
    const meta = {
      requestId: req.id || "N/A",
      method: req.method,
      path: req.path,
      ip: req.ip,
      userId: req.userId || "anonymous",
    };
    enhancedLogger[level](message, meta);
  },

  // Log with response context
  logResponse: (req, statusCode, message, meta = {}) => {
    const responseData = {
      requestId: req.id || "N/A",
      method: req.method,
      path: req.path,
      statusCode,
      ip: req.ip,
      userId: req.userId || "anonymous",
      ...meta,
    };

    const level = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    enhancedLogger[level](message, responseData);
  },

  // Log database operations
  logDatabase: (operation, query, duration, error = null) => {
    const meta = {
      operation,
      duration: `${duration}ms`,
      querySample: query.substring(0, 100),
    };

    if (error) {
      enhancedLogger.error(`Database Error - ${operation}`, { ...meta, error });
    } else {
      enhancedLogger.debug(`Database - ${operation}`, meta);
    }
  },

  // Log authentication events
  logAuth: (event, userId, details = {}) => {
    const meta = {
      event,
      userId,
      timestamp: new Date().toISOString(),
      ...details,
    };
    enhancedLogger.info(`Auth - ${event}`, meta);
  },

  // Get Sentry instance for manual use
  getSentry: () => Sentry,
};

module.exports = enhancedLogger;


