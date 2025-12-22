require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/portfolio', async (req, res) => {
  try {
    const q = `SELECT id, title, description, category, image_url, thumbnail_url, style, duration, size, is_featured FROM portfolio_items ORDER BY display_order NULLS LAST, created_at DESC LIMIT 200`;
    const { rows } = await pool.query(q);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database error' });
  }
});

app.post('/api/booking', async (req, res) => {
  const { name, email, phone, preferred_date, appointment_type, anime_reference, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email, message required' });

  try {
    const q = `INSERT INTO bookings (name, email, phone, preferred_date, appointment_type, anime_reference, message) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, status, created_at`;
    const vals = [name, email, phone || null, preferred_date || null, appointment_type || null, anime_reference || null, message];
    const { rows } = await pool.query(q, vals);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'database insert error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
