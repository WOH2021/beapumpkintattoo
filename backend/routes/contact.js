const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Validation middleware for contact form
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').escape(),
  body('subject').optional().trim().escape(),
];

// POST /api/contact - Submit contact form (public)
router.post('/', contactValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, subject, message } = req.body;

    const { rows } = await db.query(
      `INSERT INTO contact_submissions (name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, subject, message]
    );

    // TODO: In production, also send email notification to admin
    
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      submission: rows[0]
    });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/contact (admin) - Get all contact submissions
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { unread } = req.query;
    let query = 'SELECT * FROM contact_submissions';
    
    if (unread === 'true') {
      query += ' WHERE is_read = false';
    }
    
    query += ' ORDER BY created_at DESC';
    
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error('Get contacts error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/contact/:id - Mark as read (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    const { rows } = await db.query(
      'UPDATE contact_submissions SET is_read = $1 WHERE id = $2 RETURNING *',
      [is_read, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Update contact error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
