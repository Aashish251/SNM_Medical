const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { testConnection } = require("./config/database");
require("dotenv").config();
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const errorMiddleware = require("./middlewares/error");
const requestLogger = require("./middlewares/requestLogger");
const logger = require("./utils/logger");

// Initialize Sentry if available
let Sentry = null;
try {
  Sentry = logger.getSentry();
  if (Sentry) {
    // Sentry initialization handled in logger.js
  }
} catch (error) {
  logger.warn("Sentry not available", { error: error.message });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Sentry request handler (must be first if using Sentry)
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//  __dirname works automatically in CommonJS (no need for fileURLToPath)
const __dirnameResolved = __dirname;

// ✅ Serve static files from /uploads folder FIRST (before middleware)
// Legacy profile_img URLs should read from the current profile folder.
app.use("/uploads/profile_img", express.static(path.join(__dirnameResolved, "../uploads/profile")));

// Add cache control headers and CORS for static files
app.use("/uploads", (req, res, next) => {
  // Allow cross-origin requests for files
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");

  // Set appropriate cache headers (30 days for versioned files)
  res.header("Cache-Control", "public, max-age=2592000, immutable");
  res.header("Pragma", "public");
  res.header("Expires", new Date(Date.now() + 2592000000).toUTCString());

  next();
}, express.static(path.join(__dirnameResolved, "../uploads")));

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "http://localhost:5000"],
        // Allow loading documents/PDFs from uploads
        objectSrc: ["'self'", "http://localhost:5000"],
        mediaSrc: ["'self'", "http://localhost:5000"],
        fontSrc: ["'self'", "data:"],
      },
    },
  })
);

// Logging (before routes)
app.use(
  morgan("combined", {
    skip: function (req, res) {
      return res.statusCode < 400 && process.env.NODE_ENV === "production";
    },
  })
);

// Request logging middleware (tracks request ID and response time)
app.use(requestLogger);

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(` ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

/*
  Body parsers must be registered before route modules that accept JSON.
  Multer still handles multipart/form-data on upload routes.
*/

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Main routes (file/form-data routes first, e.g. registration)
try {
  app.use("/api/registration", require("./routes/registration")); // includes file upload endpoints
  app.use("/api/dashboard", require("./routes/dashboard")); // includes profile update with file upload

  // Rate limiter for auth routes (brute-force protection)
  const authRateLimitMap = new Map();
  const AUTH_RATE_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000; // 15 min
  const AUTH_RATE_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 10;

  const authRateLimiter = (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const entry = authRateLimitMap.get(key);

    if (!entry || now - entry.start > AUTH_RATE_WINDOW) {
      authRateLimitMap.set(key, { start: now, count: 1 });
      return next();
    }

    entry.count++;
    if (entry.count > AUTH_RATE_MAX) {
      logger.warn('Auth rate limit exceeded', { ip: key, count: entry.count });
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.',
      });
    }

    return next();
  };

  // Clean up rate limit map periodically (every 10 min)
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of authRateLimitMap) {
      if (now - entry.start > AUTH_RATE_WINDOW) authRateLimitMap.delete(key);
    }
  }, 600000);

  // All other non-file routes
  app.use("/api/auth", authRateLimiter, require("./routes/auth"));
  app.use("/api/user", require("./routes/user"));
  app.use("/api/search", require("./routes/search"));
  app.use("/api/community", require("./routes/community"));
  app.use("/api/patients", require("./routes/patients"));
  app.use("/api/masters", require("./routes/masters"));
  app.use("/api/dutychart", require("./routes/dutychart"));
  app.use("/api/reports", require("./routes/reports"));
  app.use("/", require("./routes/formCompat"));
} catch (error) {
  logger.error("Error loading routes", { error: error.message });
  logger.error("Make sure all route files exist in the routes/ directory");
}

// Health check endpoints
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "SNM Dispensary Server is running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health/db", async (req, res) => {
  const isConnected = await testConnection();
  res.status(isConnected ? 200 : 500).json({
    message: isConnected
      ? "SNM Dispensary Database connected"
      : "Database connection failed",
    database: "snm_dispensary",
    timestamp: new Date().toISOString(),
  });
});

// Health check for file uploads
app.get("/api/health/uploads", (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, '../uploads');

  const checkDir = (dirPath) => {
    try {
      return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    } catch {
      return false;
    }
  };

  const profileExists = checkDir(path.join(uploadsPath, 'profile'));
  const certificatesExists = checkDir(path.join(uploadsPath, 'certificates'));

  res.status(200).json({
    message: "Upload directories status",
    uploadsPath: uploadsPath,
    directories: {
      profile: profileExists,
      certificates: certificatesExists,
      root: checkDir(uploadsPath)
    },
    timestamp: new Date().toISOString(),
  });
});

// API overview
app.get("/api", (req, res) => {
  res.json({
    message: "SNM Dispensary API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      authentication: "/api/auth",
      registration: "/api/registration",
      dashboard: "/api/dashboard",
      community: "/api/community",
      patients: "/api/patients",
      masters: "/api/masters",
      search: "/api/search",
      dutychart: "/api/dutychart",
      reports: "/api/reports",
      health: "/health",
      dbHealth: "/api/health/db",
    },
    status: "Active",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler (MUST be before error handlers)
app.use("*", (req, res) => {
  logger.warn("404 - Route not found", {
    method: req.method,
    path: req.originalUrl,
  });
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Sentry error handler (must be before other error handlers)
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}

// Custom error handling middleware (AFTER all routes)
app.use(errorMiddleware);

// Fallback error handler for unhandled errors
app.use((err, req, res, next) => {
  logger.error("Unhandled Server Error", {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
    timestamp: new Date().toISOString(),
  });
});

// Start server/check DB
const startServer = async () => {
  const dbConnected = await testConnection();
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`   • Health: http://localhost:${PORT}/health`);
      console.log(`   • API Overview: http://localhost:${PORT}/api`)
      console.log(`   • Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  } else {
    console.error(
      " Failed to connect to snm_dispensary database. Server not started."
    );
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n Received SIGINT. Gracefully shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM. Gracefully shutting down...");
  process.exit(0);
});

startServer();
