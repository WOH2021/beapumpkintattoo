require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
app.use(helmet());
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Import routes
const bookingRoutes = require('./routes/booking');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const portfolioRoutes = require('./routes/portfolio');
const blogRoutes = require('./routes/blog');
const testimonialRoutes = require('./routes/testimonials');
const designRoutes = require('./routes/design');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Mount routes
app.use('/api/booking', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/design', designRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));