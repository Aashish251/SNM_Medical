const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { testConnection } = require("./config/database");
require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ __dirname works automatically in CommonJS (no need for fileURLToPath)
const __dirnameResolved = __dirname;

// ✅ Serve static files from /uploads folder
app.use("/uploads", express.static(path.join(__dirnameResolved, "../uploads")));

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Logging
app.use(
  morgan("combined", {
    skip: function (req, res) {
      return res.statusCode < 400 && process.env.NODE_ENV === "production";
    },
  })
);

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(` ${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

/* ------------------------------------------------------------
   File upload and API routes
------------------------------------------------------------ */
try {
  app.use("/api/registration", require("./routes/registration"));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  app.use("/api/auth", require("./routes/auth"));
  app.use("/api/dashboard", require("./routes/dashboard"));
  app.use("/api/search", require("./routes/search"));
  app.use("/api/dutychart", require("./routes/dutychart"));
  app.use("/api/reports", require("./routes/reports"));
} catch (error) {
  console.error("❌ Error loading routes:", error.message);
}

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "SNM Dispensary Server is running!",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Database health check
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log(` 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Start server
const startServer = async () => {
  const dbConnected = await testConnection();
  if (dbConnected) {
    app.listen(PORT, () => {
      console.log(`✅ SNM Dispensary Server running on port ${PORT}`);
      console.log(`📁 Static files served from /uploads`);
      console.log(`🌐 Visit: http://localhost:${PORT}/uploads`);
    });
  } else {
    console.error("❌ Failed to connect to the database. Server not started.");
    process.exit(1);
  }
};

startServer();
