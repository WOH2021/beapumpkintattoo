/**
 * Authentication Routes
 * Handles login and token generation
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ⚠️ CRITICAL: Environment variables MUST be set
// Do not use unsafe defaults in production!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Validate that critical credentials are configured
if (!ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
  throw new Error('CRITICAL: ADMIN_PASSWORD environment variable must be set in production');
}

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('CRITICAL: JWT_SECRET or SUPABASE_JWT_SECRET environment variable must be set in production');
}

// Use secure defaults only in development
const finalAdminPassword = ADMIN_PASSWORD || 'dev-only-default-change-in-production';
const finalJwtSecret = JWT_SECRET || 'dev-only-secret-change-in-production';

/**
 * POST /api/auth/login
 * Authenticate with admin password and get JWT token
 * 
 * Body:
 *   - password (string, required)
 * 
 * Response:
 *   - token (JWT token valid for 24 hours)
 *   - expiresIn (seconds)
 */
router.post('/login', (req, res) => {
  try {
    const { password } = req.body;

    // Validate password is provided
    if (!password) {
      return res.status(400).json({
        error: 'Validation failed',
        details: ['Password is required']
      });
    }

    // Verify password
    if (password !== finalAdminPassword) {
      // Log security event (don't expose which field is wrong)
      console.warn('Failed login attempt from', req.ip);
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        admin: true,
        type: 'password-auth',
        iat: Math.floor(Date.now() / 1000),
      },
      finalJwtSecret,
      {
        algorithm: 'HS256',
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    // Return token (never send password back)
    res.json({
      success: true,
      token,
      expiresIn: getExpirationSeconds(JWT_EXPIRES_IN),
      tokenType: 'Bearer',
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      error: 'Authentication failed'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout endpoint (for frontend reference)
 * Note: JWT is stateless, so logout is client-side
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove token from client storage.'
  });
});

/**
 * GET /api/auth/verify
 * Verify if a token is still valid
 * 
 * Headers:
 *   - Authorization: Bearer <token>
 */
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const token = authHeader.substring(7);
    jwt.verify(token, finalJwtSecret, { algorithms: ['HS256'] });

    res.json({
      success: true,
      valid: true,
      message: 'Token is valid'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      valid: false,
      error: 'Token is invalid or expired'
    });
  }
});

/**
 * Helper: Convert expiration string to seconds
 */
function getExpirationSeconds(expiresIn) {
  if (typeof expiresIn === 'number') return expiresIn;
  
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 86400; // default 24 hours

  const value = parseInt(match[1]);
  const unit = match[2];

  const units = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  return value * (units[unit] || 86400);
}

module.exports = router;
