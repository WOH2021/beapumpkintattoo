/**
 * Simple Password-Based Authentication Middleware
 * For protected admin/content management endpoints
 */

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme123';

/**
 * Verify password from request
 * Password can be sent via:
 * - Query parameter: ?password=xxxxx
 * - Body field: { password: 'xxxxx' }
 * - Header: X-Admin-Password: xxxxx
 */
function verifyAdminPassword(req, res, next) {
  const password = 
    req.query.password || 
    req.body?.password || 
    req.headers['x-admin-password'] ||
    null;

  if (!password) {
    return res.status(401).json({ 
      error: 'Unauthorized: Admin password required',
      hint: 'Pass password as ?password=XXX or in body'
    });
  }

  if (password !== ADMIN_PASSWORD) {
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
