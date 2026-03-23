/**
 * Authentication Middleware for Admin Routes
 * Verifies JWT tokens and admin role
 */

const jwt = require('jsonwebtoken');
const { supabase } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET || 'your-secret-key';

/**
 * Verify JWT Token from Authorization header
 * Expected format: "Bearer <token>"
 */
function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify Admin Authentication
 * Middleware to check if user is authenticated and has admin role
 */
async function verifyAdminAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    // ✅ Verify JWT signature (not just decode)
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256', 'HS512'],
      });
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Verify user has admin role in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, email')
      .eq('id', decoded.sub)
      .single();

    if (userError || !userData) {
      return res.status(403).json({ error: 'User not found' });
    }

    if (userData.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Attach user info to request
    req.user = {
      id: decoded.sub,
      email: userData.email,
      role: userData.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional Authentication
 * User can be authenticated but not required
 */
async function verifyOptionalAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      req.user = null;
      return next();
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256', 'HS512'],
      });
    } catch (error) {
      req.user = null;
      return next();
    }

    if (!decoded || !decoded.sub) {
      req.user = null;
      return next();
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role, email')
      .eq('id', decoded.sub)
      .single();

    req.user = userData ? {
      id: decoded.sub,
      email: userData.email,
      role: userData.role,
    } : null;

    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

/**
 * Verify User Authentication
 * User must be authenticated (any role)
 */
async function verifyAuth(req, res, next) {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS256', 'HS512'],
      });
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, email')
      .eq('id', decoded.sub)
      .single();

    if (userError || !userData) {
      return res.status(403).json({ error: 'User not found' });
    }

    req.user = {
      id: decoded.sub,
      email: userData.email,
      role: userData.role,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = {
  verifyAdminAuth,
  verifyAuth,
  verifyOptionalAuth,
  getTokenFromHeader,
};
