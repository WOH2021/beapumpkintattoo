require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/portfolio', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('id, title, description, category, image_url, thumbnail_url, style, duration, size, is_featured')
      .order('display_order', { nulls: 'last' })
      .order('created_at', { ascending: false })
      .limit(200);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error fetching portfolio items:', err);
    res.status(500).json({ error: 'Database error while fetching portfolio items.' });
  }
});

app.post('/api/booking', async (req, res) => {
  const { name, email, phone, preferred_date, appointment_type, anime_reference, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'The fields name, email, and message are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{ 
        name, 
        email, 
        phone, 
        preferred_date, 
        appointment_type, 
        anime_reference, 
        message 
      }])
      .select('id, status, created_at');

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Database error while creating a booking.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));