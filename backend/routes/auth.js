const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const { authenticateToken, generateToken } = require('../middleware/auth');

// POST /api/auth/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/logout - Admin logout
router.post('/logout', authenticateToken, (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint can be used to invalidate tokens in a blacklist if needed
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/register - Create admin user (protected - only existing admins can create new ones)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    // Only admins can create new users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const { rows } = await db.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, password_hash, name, 'admin']
    );

    res.status(201).json({
      success: true,
      user: rows[0]
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/setup - Initial admin setup (only works if no users exist)
router.post('/setup', async (req, res) => {
  try {
    // Check if any users exist
    const { rows: existingUsers } = await db.query('SELECT COUNT(*) FROM users');
    if (parseInt(existingUsers[0].count) > 0) {
      return res.status(403).json({ error: 'Setup already completed. Use login instead.' });
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create first admin user
    const { rows } = await db.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
      [email, password_hash, name || 'Admin', 'admin']
    );

    // Generate token for immediate login
    const token = generateToken(rows[0]);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      user: rows[0]
    });
  } catch (err) {
    console.error('Setup error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
