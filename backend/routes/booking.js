const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/booking - Submit booking request
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, preferred_date, appointment_type, anime_reference, message, reference_images } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const { rows } = await db.query(
      `INSERT INTO bookings (name, email, phone, preferred_date, appointment_type, anime_reference, message, reference_images)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, email, phone, preferred_date || null, appointment_type, anime_reference, message, reference_images || []]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Booking request submitted successfully',
      booking: rows[0] 
    });
  } catch (err) {
    console.error('Booking error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/booking/:id - Get booking status
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get booking error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
