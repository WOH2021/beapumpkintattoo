const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/blog - Get blog posts
router.get('/', async (req, res) => {
  try {
    const { category, limit } = req.query;
    let query = 'SELECT * FROM blog_posts WHERE is_published = true';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    query += ' ORDER BY published_at DESC';

    if (limit) {
      params.push(parseInt(limit));
      query += ` LIMIT $${params.length}`;
    }

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get blog posts error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/blog/:slug - Get single post
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await db.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get blog post error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/blog (admin) - Create post
router.post('/', async (req, res) => {
  try {
    const { title, slug, excerpt, content, featured_image, category, author_id, read_time, is_published } = req.body;

    // Validate required fields
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const published_at = is_published ? new Date() : null;

    const { rows } = await db.query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, category, author_id, read_time, is_published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, slug, excerpt, content, featured_image, category, author_id, read_time, is_published || false, published_at]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create blog post error:', err.message);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'A blog post with this slug already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/blog/:slug - Update post
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, excerpt, content, featured_image, category, read_time, is_published } = req.body;

    // Check if publishing for the first time
    const existing = await db.query('SELECT is_published, published_at FROM blog_posts WHERE slug = $1', [slug]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    let published_at = existing.rows[0].published_at;
    if (is_published && !existing.rows[0].is_published) {
      published_at = new Date();
    }

    const { rows } = await db.query(
      `UPDATE blog_posts SET title = COALESCE($1, title), excerpt = COALESCE($2, excerpt), 
       content = COALESCE($3, content), featured_image = COALESCE($4, featured_image),
       category = COALESCE($5, category), read_time = COALESCE($6, read_time),
       is_published = COALESCE($7, is_published), published_at = $8, updated_at = now()
       WHERE slug = $9 RETURNING *`,
      [title, excerpt, content, featured_image, category, read_time, is_published, published_at, slug]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Update blog post error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
