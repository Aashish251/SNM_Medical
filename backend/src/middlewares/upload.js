/**
 * File Upload Configuration using Multer
 * --------------------------------------
 * Handles uploads for:
 * - Profile Images  →  uploads/profile/
 * - Certificates    →  uploads/certificates/
 * - Others          →  uploads/others/
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

const BASE_UPLOAD_DIR = path.join(__dirname, "../../uploads");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    if (["profilePic", "profileImage"].includes(file.fieldname)) {
      folder = "profile";
    } else if (file.fieldname === "certificate") {
      folder = "certificates";
    }

    const fullPath = path.join(BASE_UPLOAD_DIR, folder);
    ensureDir(fullPath);

    cb(null, fullPath);
  },

  filename: (req, file, cb) => {
    const safeName =
      file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    cb(null, `${Date.now()}_${safeName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".pdf", ".webp", ".doc", ".docx", ".xls", ".xlsx", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    logger.warn("Invalid file upload attempt", { ext });
    return cb(new Error("Invalid file type"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;

