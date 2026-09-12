/**
 * File Path Helper Utilities
 * Supports Cloudinary cloud storage with automatic local disk fallback.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const BACKEND_ROOT = path.resolve(__dirname, '../..');

const getUploadRoot = () => {
  const configuredPath = process.env.UPLOAD_DIR || 'uploads';
  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(BACKEND_ROOT, configuredPath);
};

exports.getUploadRoot = getUploadRoot;

/**
 * Uploads a file directly to Cloudinary
 * @param {object} file - Multer file object
 * @param {string} category - folder category ('profile', 'certificates', 'others')
 * @param {string|number|null} userId - optional user identifier
 * @param {string|null} userName - optional user name
 * @returns {Promise<string>} - Cloudinary secure HTTPS URL
 */
const uploadFileToCloudinary = async (
  file,
  category = 'others',
  userId = null,
  userName = null
) => {
  if (!file || !file.path) {
    return null;
  }

  const validCategories = ['profile', 'certificates', 'others'];
  if (!validCategories.includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }

  // Generate public_id for Cloudinary asset
  let publicId;
  if (userId && userName) {
    publicId = `${userId}_${userName.replace(/\s+/g, '_')}_${uuidv4()}`;
  } else {
    publicId = `${uuidv4()}`;
  }

  try {
    const uploadOptions = {
      folder: `snm_medical/${category}`,
      public_id: publicId,
      resource_type: 'auto',
      overwrite: true,
    };

    logger.info('Uploading file to Cloudinary', {
      category,
      path: file.path,
      folder: uploadOptions.folder,
    });

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);

    logger.info('File uploaded to Cloudinary successfully', {
      category,
      publicId: result.public_id,
      secureUrl: result.secure_url,
    });

    // Remove local temporary file
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (cleanupErr) {
      logger.warn('Failed to clean up temp file after Cloudinary upload', {
        path: file.path,
        error: cleanupErr.message,
      });
    }

    return result.secure_url;
  } catch (error) {
    logger.error('Cloudinary upload error', {
      category,
      error: error.message,
    });

    // Do NOT delete file here so fallback to local disk can succeed
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

exports.uploadFileToCloudinary = uploadFileToCloudinary;

/**
 * Stores file on local disk (/uploads/<category>/<fileName>)
 */
const saveFileToLocalDisk = async (
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

    // DB will store: /uploads/profile/filename.jpg
    return `/uploads/${category}/${fileName}`;
  } catch (error) {
    logger.error('Local file upload failed', { category, error: error.message });

    if (file?.path) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (_) {}
    }

    throw new Error(`File upload failed: ${error.message}`);
  }
};

/**
 * Universal file upload function:
 * 1. Checks if Cloudinary is configured. If yes, uploads to Cloudinary.
 * 2. If Cloudinary is not configured or fails, falls back safely to local storage.
 */
const uploadFile = async (
  file,
  category = 'others',
  userId = null,
  userName = null
) => {
  if (!file || !file.path) {
    return null;
  }

  if (isCloudinaryConfigured()) {
    try {
      return await uploadFileToCloudinary(file, category, userId, userName);
    } catch (err) {
      logger.warn('Cloudinary upload failed, attempting local fallback...', {
        error: err.message,
      });
      return await saveFileToLocalDisk(file, category, userId, userName);
    }
  }

  logger.info('Cloudinary not configured, storing file locally.');
  return await saveFileToLocalDisk(file, category, userId, userName);
};

exports.uploadFile = uploadFile;

/**
 * Main backward-compatible function used by existing controllers/routes.
 * Delegates to Cloudinary if configured, otherwise saves locally.
 */
exports.uploadFileToLocal = async (
  file,
  category = 'others',
  userId = null,
  userName = null
) => {
  return await uploadFile(file, category, userId, userName);
};

/**
 * Helper to delete a file from Cloudinary given its URL or public ID
 * @param {string} publicIdOrUrl - The Cloudinary public_id or secure_url
 * @returns {Promise<boolean>}
 */
exports.deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!publicIdOrUrl || !isCloudinaryConfigured()) return false;

  try {
    let publicId = publicIdOrUrl;

    // If a full Cloudinary URL was provided, extract the public_id
    if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
      const parts = publicIdOrUrl.split('/upload/');
      if (parts.length === 2) {
        // e.g. "v1234567890/snm_medical/profile/filename.ext" -> "snm_medical/profile/filename"
        const afterUpload = parts[1].replace(/^v\d+\//, '');
        publicId = afterUpload.substring(0, afterUpload.lastIndexOf('.')) || afterUpload;
      }
    }

    const result = await cloudinary.uploader.destroy(publicId);
    logger.info('Cloudinary deletion result', { publicId, result });
    return result.result === 'ok';
  } catch (error) {
    logger.warn('Failed to delete asset from Cloudinary', {
      publicIdOrUrl,
      error: error.message,
    });
    return false;
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
 * IMPORTANT: Preserves remote HTTP/HTTPS Cloudinary URLs untouched!
 * @param {string} filePath - Path to normalize
 * @returns {string} Normalized path
 */
exports.normalizeFilePath = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return filePath;

  // If already a remote URL (Cloudinary or CDN), return as-is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // 1. Remove absolute prefixes (e.g., from Render/Server paths)
  let normalized = filePath.replace(/.*\/uploads\//, '/uploads/');

  // 2. Ensure it starts with /uploads/
  if (!normalized.startsWith('/uploads/') && !normalized.startsWith('uploads/')) {
    if (!normalized.includes('/')) {
      // just a filename
    }
  }

  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }

  // 3. Map legacy profile_img to profile
  normalized = normalized.replace(/\/uploads\/profile_img\//, '/uploads/profile/');

  return normalized;
};
