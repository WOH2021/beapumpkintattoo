/**
 * ⚠️ DEPRECATED: Simple Password-Based Authentication Middleware
 * DO NOT USE FOR PRODUCTION - Use JWT auth (auth.js) instead
 * 
 * This middleware is kept for backward compatibility only.
 * All new routes should use JWT authentication via middleware/auth.js
 * 
 * For protected admin/content management endpoints, use verifyAdminAuth from auth.js
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Validate password is configured for production
if (!ADMIN_PASSWORD && process.env.NODE_ENV === 'production') {
  throw new Error('CRITICAL: ADMIN_PASSWORD environment variable must be set in production');
}

// Use secure default only in development
const finalAdminPassword = ADMIN_PASSWORD || 'dev-only-default-change-in-production';

/**
 * ⚠️ DEPRECATED: Verify password from request body or header ONLY
 * NO LONGER ACCEPTS QUERY PARAMETERS (security fix)
 * 
 * Password should be sent via:
 * - Body field: { password: 'xxxxx' }
 * - Header: X-Admin-Password: xxxxx
 * 
 * NEVER use query parameters for sensitive data!
 */
function verifyAdminPassword(req, res, next) {
  const password = 
    req.body?.password || 
    req.headers['x-admin-password'] ||
    null;

  if (!password) {
    return res.status(401).json({ 
      error: 'Unauthorized: Admin password required',
      hint: 'Pass password in body { password: "..." } or header X-Admin-Password',
      deprecated: 'This endpoint uses deprecated auth. Migrate to JWT auth (see docs).'
    });
  }

  if (password !== finalAdminPassword) {
    // Log security event (don't expose which field is wrong)
    console.warn('Failed login attempt from', req.ip, 'using deprecated simple-auth');
    return res.status(403).json({ 
      error: 'Forbidden: Incorrect admin password' 
    });
  }

  // Password is correct, continue to next middleware
  next();
}

module.exports = {
  verifyAdminPassword,
};
