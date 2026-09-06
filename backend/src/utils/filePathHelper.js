/**
 * File Path Helper Utilities with Local Storage
 * Stores files in the local /uploads directory
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

const BACKEND_ROOT = path.resolve(__dirname, '../..');

const getUploadRoot = () => {
  const configuredPath = process.env.UPLOAD_DIR || 'uploads';
  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(BACKEND_ROOT, configuredPath);
};

exports.getUploadRoot = getUploadRoot;

exports.uploadFileToLocal = async (
  file,
  category = 'others',
  userId = null,
  userName = null
) => {
  if (!file || !file.path) {
    return null;
  }

  try {
    const validCategories = ['profile', 'certificates', 'others'];
    if (!validCategories.includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    const extension = path.extname(file.originalname).toLowerCase();

    let fileName;
    if (userId && userName) {
      fileName = `${userId}_${userName.replace(/\s+/g, '_')}_${uuidv4()}${extension}`;
    } else {
      fileName = `${uuidv4()}${extension}`;
    }

    // Create local uploads directory structure
    const uploadsDir = path.join(getUploadRoot(), category);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);

    // Move file from temp location to uploads directory
    fs.renameSync(file.path, filePath);

    logger.info('File uploaded to local storage', { category, fileName });

    //  DB will store: /uploads/profile/filename.jpg
    return `/uploads/${category}/${fileName}`;
  } catch (error) {
    logger.error('File upload failed', { category, error: error.message });

    if (file?.path) {
      try {
        fs.unlinkSync(file.path);
      } catch (_) { }
    }

    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * Returns a relative file path for storage in DB
 * @param {object} file - Multer file object
 * @param {string} category - folder category
 * @returns {string} Relative path /uploads/...
 */
exports.getRelativeFilePath = (file, category = 'others') => {
  if (!file || !file.filename) return null;

  // Standardize category mapping
  const mappedCategory = category === 'profile_img' ? 'profile' : category;

  return `/uploads/${mappedCategory}/${file.filename}`;
};

/**
 * Normalizes a file path to be relative and standard
 * Handles absolute paths and incorrect category names
 * @param {string} filePath - Path to normalize
 * @returns {string} Normalized path
 */
exports.normalizeFilePath = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return filePath;

  // 1. Remove absolute prefixes (e.g., from Render/Server paths)
  let normalized = filePath.replace(/.*\/uploads\//, '/uploads/');

  // 2. Ensure it starts with /uploads/
  if (!normalized.startsWith('/uploads/') && !normalized.startsWith('uploads/')) {
    // If it's just a filename, assume it belongs to others or guess based on context IF possible
    // but better to just return as is if unsure, or prefix with /uploads/
    if (normalized.includes('/')) {
      // already has path but not uploads
    } else {
      // just a filename?
    }
  }

  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }

  // 3. Map legacy profile_img to profile
  normalized = normalized.replace(/\/uploads\/profile_img\//, '/uploads/profile/');

  return normalized;
};
