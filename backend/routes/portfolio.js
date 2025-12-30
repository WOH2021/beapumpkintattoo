const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/portfolio - Get portfolio items (public)
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM portfolio_items ORDER BY display_order ASC');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/portfolio/:id - Get single portfolio item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM portfolio_items WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Portfolio item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/portfolio (admin) - Create portfolio item
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, category, image_url, thumbnail_url, style, duration, size, is_featured, display_order } = req.body;
    const { rows } = await db.query(
      'INSERT INTO portfolio_items (title, description, category, image_url, thumbnail_url, style, duration, size, is_featured, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [title, description, category, image_url, thumbnail_url, style, duration, size, is_featured, display_order]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/portfolio/:id - Update portfolio item (admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, image_url, thumbnail_url, style, duration, size, is_featured, display_order } = req.body;
    const { rows } = await db.query(
      'UPDATE portfolio_items SET title = $1, description = $2, category = $3, image_url = $4, thumbnail_url = $5, style = $6, duration = $7, size = $8, is_featured = $9, display_order = $10, updated_at = now() WHERE id = $11 RETURNING *',
      [title, description, category, image_url, thumbnail_url, style, duration, size, is_featured, display_order, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Portfolio item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/portfolio/:id - Delete portfolio item (admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM portfolio_items WHERE id = $1', [id]);
    
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }
    
    res.json({ success: true, message: 'Portfolio item deleted' });
  } catch (err) {
    console.error('Delete portfolio error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
