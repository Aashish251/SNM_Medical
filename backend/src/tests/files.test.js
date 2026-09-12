const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const filesRoute = require('../routes/files');
const jwtConfig = require('../config/jwt');
const { promisePool } = require('../config/database');

const app = express();
app.use(express.json());
app.use('/api/files', filesRoute);

jest.mock('../config/database', () => ({
  promisePool: {
    execute: jest.fn(),
  },
}));

const UPLOADS_ROOT = path.resolve(__dirname, '../../uploads');

describe('GET /api/files/view', () => {
  let adminToken, userToken;

  beforeAll(() => {
    // Make sure uploads root exists during tests
    if (!fs.existsSync(UPLOADS_ROOT)) {
      fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
    }

    adminToken = jwt.sign(
      { userId: 1, userType: 'admin', loginId: 'admin1' },
      jwtConfig.secret || process.env.JWT_SECRET || 'test_secret'
    );

    userToken = jwt.sign(
      { userId: 10, userType: 'medical_staff', loginId: 'staff1' },
      jwtConfig.secret || process.env.JWT_SECRET || 'test_secret'
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no auth header is provided', async () => {
    const res = await request(app).get('/api/files/view?regId=10');
    expect(res.status).toBe(401);
  });

  it('should return 403 when User A requests User B\'s document', async () => {
    const res = await request(app)
      .get('/api/files/view?regId=11')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(403);
  });

  it('should allow admin to request any user\'s document', async () => {
    promisePool.execute.mockResolvedValueOnce([[{ certificate_doc_path: '/uploads/cert11.pdf' }]]);

    const res = await request(app)
      .get('/api/files/view?regId=11')
      .set('Authorization', `Bearer ${adminToken}`);
    
    // It should hit the route logic and try to fetch from DB
    expect(promisePool.execute).toHaveBeenCalledWith(
      'SELECT certificate_doc_path FROM registration_tbl WHERE reg_id = ?',
      ['11']
    );
    expect(res.status).toBe(200); // Might be notice PDF if file not on disk, but not 403
  });

  it('should prevent path traversal attacks', async () => {
    // Malicious path in DB
    promisePool.execute.mockResolvedValueOnce([[{ certificate_doc_path: '/uploads/../../../etc/passwd' }]]);

    const res = await request(app)
      .get('/api/files/view?regId=10')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid path');
  });

  it('should return 200 with notice PDF and missing header when file is missing from disk', async () => {
    promisePool.execute.mockResolvedValueOnce([[{ certificate_doc_path: '/uploads/doesnotexist.pdf' }]]);

    const res = await request(app)
      .get('/api/files/view?regId=10')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.headers['x-document-status']).toBe('missing');
    expect(res.headers['content-type']).toBe('application/pdf');
    // Notice PDF should be returned
    expect(res.body).toBeInstanceOf(Buffer);
  });

  it('should stream valid local file', async () => {
    const testFilePath = path.join(UPLOADS_ROOT, 'test_cert.pdf');
    fs.writeFileSync(testFilePath, 'dummy pdf content');

    promisePool.execute.mockResolvedValueOnce([[{ certificate_doc_path: '/uploads/test_cert.pdf' }]]);

    const res = await request(app)
      .get('/api/files/view?regId=10')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(res.headers['content-disposition']).toBe('inline; filename="test_cert.pdf"');
    expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin');
    
    // Clean up
    fs.unlinkSync(testFilePath);
  });
});
