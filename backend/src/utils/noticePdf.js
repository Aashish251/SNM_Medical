const fs = require('fs');

function createNoticePdf(message, filename) {
  const cleanMsg = (message || 'Document Notice').replace(/[()\\]/g, '');
  const cleanFile = ('File: ' + (filename || 'Unknown')).replace(/[()\\]/g, '');
  const cleanTip = 'This file is not present in local storage. Please update the certificate if needed.';
  
  const content = [
    'BT',
    '/F1 18 Tf',
    '50 720 Td',
    `(${cleanMsg}) Tj`,
    'ET',
    'BT',
    '/F1 12 Tf',
    '50 680 Td',
    `(${cleanFile}) Tj`,
    'ET',
    'BT',
    '/F1 11 Tf',
    '50 650 Td',
    `(${cleanTip}) Tj`,
    'ET'
  ].join('\n');

  const streamLength = Buffer.byteLength(content, 'utf8');

  const body = [
    '%PDF-1.4',
    '1 0 obj',
    '<< /Type /Catalog /Pages 2 0 R >>',
    'endobj',
    '2 0 obj',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    'endobj',
    '3 0 obj',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    'endobj',
    '4 0 obj',
    `<< /Length ${streamLength} >>`,
    'stream',
    content,
    'endstream',
    'endobj',
    '5 0 obj',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    'endobj',
    'xref',
    '0 6',
    '0000000000 65535 f ',
    '0000000009 00000 n ',
    '0000000058 00000 n ',
    '0000000115 00000 n ',
    '0000000234 00000 n ',
    '0000000300 00000 n ',
    'trailer',
    '<< /Size 6 /Root 1 0 R >>',
    'startxref',
    '377',
    '%%EOF'
  ].join('\n');

  return Buffer.from(body, 'utf8');
}

module.exports = { createNoticePdf };
