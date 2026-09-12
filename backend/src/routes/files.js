const express = require('express');
const router = express.Router();
const https = require('https');
const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const { getUploadRoot } = require('../utils/filePathHelper');
const { createNoticePdf } = require('../utils/noticePdf');
const logger = require('../utils/logger');
const authenticateToken = require('../middlewares/auth');
const { promisePool } = require('../config/database');

/**
 * Extracts public_id and format from a Cloudinary URL
 */
function parseCloudinaryUrl(url) {
  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let afterUpload = url.substring(uploadIndex + 8);
    // Remove version prefix e.g. v1789204114/ or s--xxx--/v1/
    afterUpload = afterUpload.replace(/^(s--[^/]+--\/)?v\d+\//, '');

    const lastDotIndex = afterUpload.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return {
        publicId: afterUpload.substring(0, lastDotIndex),
        format: afterUpload.substring(lastDotIndex + 1).toLowerCase(),
      };
    }
    return {
      publicId: afterUpload,
      format: 'pdf',
    };
  } catch (err) {
    return null;
  }
}

/**
 * Streams a remote HTTPS URL to express response
 */
function streamRemoteUrl(targetUrl, res, filename, contentType = 'application/pdf') {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, (remoteRes) => {
      if (remoteRes.statusCode >= 200 && remoteRes.statusCode < 300) {
        res.setHeader('Content-Type', remoteRes.headers['content-type'] || contentType);
        res.setHeader('Content-Disposition', `inline; filename="${filename || 'document.pdf'}"`);
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Access-Control-Allow-Origin', '*');
        remoteRes.pipe(res);
        remoteRes.on('end', () => resolve(true));
      } else {
        reject(new Error(`Remote returned status ${remoteRes.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * GET /api/files/view?regId=<id>
 * Safely streams PDFs and documents from Cloudinary or local disk based on user's DB record.
 */
router.get('/view', authenticateToken, async (req, res) => {
  const regId = req.query.regId;
  const loggedInUserId = req.user.userId;
  const userType = req.user.userType;

  // 1. Validate Input
  if (!regId) {
    logger.warn('document_missing', { error: 'No regId provided' });
    res.setHeader('X-Document-Status', 'missing');
    const notice = createNoticePdf('No Document ID Specified', 'None');
    res.setHeader('Content-Type', 'application/pdf');
    return res.status(200).send(notice);
  }

  // 2. Authorization (canUserAccessDocument)
  if (userType !== 'admin' && String(loggedInUserId) !== String(regId)) {
    logger.warn('unauthorized_document_access', {
      userId: loggedInUserId,
      targetRegId: regId
    });
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }

  try {
    // 3. Fetch Document Path from DB
    const [rows] = await promisePool.execute(
      'SELECT certificate_doc_path FROM registration_tbl WHERE reg_id = ?',
      [regId]
    );

    if (rows.length === 0 || !rows[0].certificate_doc_path) {
      logger.warn('document_missing', { regId, error: 'Record or path not found in DB' });
      res.setHeader('X-Document-Status', 'missing');
      const notice = createNoticePdf('No Document Found for User', `ID: ${regId}`);
      res.setHeader('Content-Type', 'application/pdf');
      return res.status(200).send(notice);
    }

    const rawUrl = rows[0].certificate_doc_path;
    const cleanUrl = decodeURIComponent(rawUrl).trim();
    logger.info('File view requested', { regId, url: cleanUrl });

    // 4. Case: Cloudinary URL
    if (cleanUrl.includes('cloudinary.com') || cleanUrl.startsWith('snm_medical/')) {
      // Hard allowlist check for full URLs
      if (cleanUrl.startsWith('http')) {
         try {
           const urlObj = new URL(cleanUrl);
           if (urlObj.hostname !== 'res.cloudinary.com' || !cleanUrl.includes('/ep2sjj0f/')) {
             return res.status(400).json({ success: false, message: 'Invalid URL source' });
           }
         } catch(e) {
           return res.status(400).json({ success: false, message: 'Malformed URL' });
         }
      }

      if (isCloudinaryConfigured()) {
        const parsed = parseCloudinaryUrl(cleanUrl) || {
          publicId: cleanUrl.replace(/^\/?/, '').replace(/\.pdf$/i, ''),
          format: 'pdf',
        };

        try {
          const downloadUrl = cloudinary.utils.private_download_url(
            parsed.publicId,
            parsed.format || 'pdf',
            { resource_type: 'image', type: 'upload' }
          );

          logger.info('Streaming from Cloudinary signed download URL', { publicId: parsed.publicId });
          await streamRemoteUrl(downloadUrl, res, `${path.basename(parsed.publicId)}.pdf`);
          return;
        } catch (err1) {
          logger.warn('Cloudinary image resource stream failed, trying raw...', { error: err1.message });
          try {
            const rawDownloadUrl = cloudinary.utils.private_download_url(
              parsed.publicId + (parsed.format ? `.${parsed.format}` : ''),
              '',
              { resource_type: 'raw', type: 'upload' }
            );
            await streamRemoteUrl(rawDownloadUrl, res, `${path.basename(parsed.publicId)}.pdf`);
            return;
          } catch (err2) {
            logger.error('Both Cloudinary streaming attempts failed', { error: err2.message });
          }
        }
      }

      const filename = path.basename(cleanUrl);
      const notice = createNoticePdf('Cloudinary Document Notice', filename);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Content-Disposition', `inline; filename="${filename || 'notice.pdf'}"`);
      return res.status(200).send(notice);
    }

    // 5. Case: Local file path
    const uploadsRoot = path.resolve(getUploadRoot());
    let relativePath = cleanUrl.replace(/^\/?uploads\/?/, '');
    relativePath = relativePath.split(/[/\\]/).join(path.sep);
    
    // Path Traversal Guard
    const localFilePath = path.resolve(uploadsRoot, relativePath);
    if (!localFilePath.startsWith(uploadsRoot + path.sep)) {
      logger.error('path_traversal_attempt', { userId: loggedInUserId, targetPath: localFilePath });
      return res.status(400).json({ success: false, message: 'Invalid path' });
    }

    const filename = path.basename(localFilePath);

    if (fs.existsSync(localFilePath)) {
      logger.info('Serving local file', { path: localFilePath });
      const ext = path.extname(localFilePath).toLowerCase();
      const isPdf = ext === '.pdf';
      const contentType = isPdf
        ? 'application/pdf'
        : ext === '.png'
        ? 'image/png'
        : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return fs.createReadStream(localFilePath).pipe(res);
    }

    // If local file does not exist on disk
    logger.warn('document_missing', {
      attemptedPath: localFilePath,
      filename,
    });
    res.setHeader('X-Document-Status', 'missing');
    const noticePdf = createNoticePdf(
      'Certificate File Not Found on Local Server',
      filename
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Disposition', `inline; filename="${filename || 'notice.pdf'}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(noticePdf);

  } catch (err) {
    logger.error('File view error', { error: err.message, regId });
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
