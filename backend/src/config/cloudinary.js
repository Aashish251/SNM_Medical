const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.trim() !== '') {
    return true;
  }
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Configure Cloudinary if credentials are provided
if (isCloudinaryConfigured()) {
  if (process.env.CLOUDINARY_URL) {
    // cloudinary automatically uses CLOUDINARY_URL if present
    cloudinary.config({
      secure: true,
    });
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  logger.info('Cloudinary configured successfully', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'From CLOUDINARY_URL',
  });
} else {
  logger.warn('Cloudinary is not configured. Falling back to local disk storage.');
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};
