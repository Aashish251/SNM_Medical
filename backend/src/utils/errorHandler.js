const logger = require("./logger");

/**
 * Custom Application Error Class
 * Used for consistent error handling across the application
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isAppError = true;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Bad Request Error (400)
 */
class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

/**
 * Unauthorized Error (401)
 */
class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Forbidden Error (403)
 */
class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Not Found Error (404)
 */
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Conflict Error (409)
 */
class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * Internal Server Error (500)
 */
class InternalServerError extends AppError {
  constructor(message = "Internal server error", details = {}) {
    super(message, 500);
    this.name = "InternalServerError";
    this.details = details;
  }
}

/**
 * Database Error Handler
 */
class DatabaseError extends AppError {
  constructor(operation, originalError) {
    const message = `Database ${operation} failed: ${originalError.message}`;
    super(message, 500);
    this.name = "DatabaseError";
    this.operation = operation;
    this.originalError = originalError;

    logger.error(`Database Error in ${operation}`, {
      operation,
      message: originalError.message,
      code: originalError.code,
      errno: originalError.errno,
    });
  }
}

/**
 * Validation Error Handler
 */
class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400);
    this.name = "ValidationError";
    this.details = details;
  }
}

/**
 * Async route wrapper to catch errors
 * Usage: router.post('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Safe function wrapper for executing database queries
 * Automatically logs errors and converts to AppError
 */
const safeDbQuery = async (operation, queryFn, errorMessage = null) => {
  const startTime = Date.now();
  try {
    const result = await queryFn();
    const duration = Date.now() - startTime;

    logger.logDatabase(operation, "", duration);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logDatabase(operation, "", duration, error);

    throw new DatabaseError(operation, error);
  }
};

/**
 * Create validation error with multiple field errors
 */
const createValidationError = (errors = {}) => {
  const errorMessages = Object.entries(errors)
    .map(([field, message]) => `${field}: ${message}`)
    .join("; ");

  return new ValidationError(
    `Validation failed: ${errorMessages}`,
    errors
  );
};

/**
 * Error response formatter
 */
const sendErrorResponse = (res, error, requestId = null) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    errorId: requestId,
    ...(process.env.NODE_ENV === "development" && {
      details: error.details || error.stack,
    }),
  });
};

module.exports = {
  // Error classes
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  DatabaseError,
  ValidationError,

  // Utility functions
  asyncHandler,
  safeDbQuery,
  createValidationError,
  sendErrorResponse,
};
