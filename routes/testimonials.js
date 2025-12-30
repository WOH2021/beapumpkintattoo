const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/testimonials - Get approved testimonials
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM testimonials WHERE is_approved = true ORDER BY display_order ASC, created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Get testimonials error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/testimonials - Submit testimonial
router.post('/', async (req, res) => {
  try {
    const { client_name, client_email, rating, review, tattoo_type, avatar_url } = req.body;

    // Validate required fields
    if (!client_name || !review) {
      return res.status(400).json({ error: 'Client name and review are required' });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const { rows } = await db.query(
      `INSERT INTO testimonials (client_name, client_email, rating, review, tattoo_type, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [client_name, client_email, rating || 5, review, tattoo_type, avatar_url]
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted for review',
      testimonial: rows[0]
    });
  } catch (err) {
    console.error('Submit testimonial error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/testimonials/:id - Approve/reject (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_approved, display_order } = req.body;

    const { rows } = await db.query(
      `UPDATE testimonials SET is_approved = COALESCE($1, is_approved), display_order = COALESCE($2, display_order)
       WHERE id = $3 RETURNING *`,
      [is_approved, display_order, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Update testimonial error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
