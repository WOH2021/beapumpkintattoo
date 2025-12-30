const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/newsletter - Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if already subscribed
    const existing = await db.query('SELECT * FROM newsletter_subscribers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      if (existing.rows[0].is_active) {
        return res.status(400).json({ error: 'Email is already subscribed' });
      }
      // Reactivate if previously unsubscribed
      await db.query('UPDATE newsletter_subscribers SET is_active = true WHERE email = $1', [email]);
      return res.json({ success: true, message: 'Welcome back! Your subscription has been reactivated.' });
    }

    await db.query(
      'INSERT INTO newsletter_subscribers (email) VALUES ($1)',
      [email]
    );

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/newsletter - Unsubscribe from newsletter
router.delete('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { rowCount } = await db.query(
      'UPDATE newsletter_subscribers SET is_active = false WHERE email = $1',
      [email]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Email not found in subscribers' });
    }

    res.json({ success: true, message: 'Successfully unsubscribed from newsletter' });
  } catch (err) {
    console.error('Newsletter unsubscribe error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
