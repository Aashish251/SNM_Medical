/**
 * File Path Helper Utilities
 * Ensures consistent relative path storage in database
 */

const path = require('path');

/**
 * Convert file path to relative URL path for database storage
 * Handles both Windows and Unix paths
 * @param {Object} file - Multer file object
 * @param {string} category - 'profile' or 'certificates'
 * @returns {string} - Relative URL path like /uploads/profile/filename.jpg
 */
exports.getRelativeFilePath = (file, category = 'others') => {
  if (!file || !file.filename) {
    return null;
  }

  const filename = file.filename;
  return `/uploads/${category}/${filename}`;
};

/**
 * Normalize any file path to relative URL format
 * Removes absolute server paths and ensures /uploads/* format
 * @param {string} filePath - Any file path (absolute or relative)
 * @returns {string|null} - Normalized relative path or null
 */
exports.normalizeFilePath = (filePath) => {
  if (!filePath || typeof filePath !== 'string' || filePath.trim() === '') {
    return null;
  }

  // Remove any backslashes and normalize to forward slashes
  filePath = filePath.replace(/\\/g, '/');

  // If already a relative /uploads/* path, return as-is
  if (filePath.startsWith('/uploads/')) {
    return filePath;
  }

  // Extract uploads path if it's an absolute path
  const uploadsMatch = filePath.match(/uploads\/([^/]+)\/(.+)$/i);
  if (uploadsMatch) {
    const category = uploadsMatch[1];
    const filename = uploadsMatch[2];
    return `/uploads/${category}/${filename}`;
  }

  // If path contains uploads/ anywhere, extract the relative part
  if (filePath.includes('uploads/')) {
    const idx = filePath.indexOf('uploads/');
    return '/' + filePath.substring(idx);
  }

  // Return as-is if it's already a valid relative path
  if (filePath.startsWith('/')) {
    return filePath;
  }

  return null;
};

module.exports = exports;
