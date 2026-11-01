require('dotenv').config();

// Fail fast if JWT_SECRET is not configured
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET must be set in .env');
  process.exit(1);
}

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  // Authenticated requests rotate the token, giving the session a 15 minute
  // sliding expiration while keeping an idle token unusable after 15 minutes.
  expiresIn: '15m',
};

module.exports = jwtConfig;
