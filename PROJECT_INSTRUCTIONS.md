# BeaPumpkin Tattoo - Project Instructions & Source of Truth

**Last Updated:** March 23, 2026  
**Project Status:** In Development - Backend API and Frontend Integration Phase

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Folder Structure](#folder-structure)
5. [Frontend Structure](#frontend-structure)
6. [Backend Structure](#backend-structure)
7. [Database Structure](#database-structure)
8. [API Endpoints](#api-endpoints)
9. [Development Setup](#development-setup)
10. [Environment Variables](#environment-variables)
11. [Key Implementation Guidelines](#key-implementation-guidelines)
12. [Deployment Information](#deployment-information)

---

## Project Overview

**Project Name:** BeaPumpkin Tattoo  
**Type:** Full-stack web application for anime tattoo artist portfolio and booking system  
**Purpose:** Professional portfolio website with booking system, blog, portfolio gallery, testimonials, and admin panel

### Current State (As of March 23, 2026)

- ✅ Frontend: Static HTML/CSS/JS with mock functionality
- ✅ Backend: Express.js API with route structure created
- ✅ Database: PostgreSQL schema defined in `backend/db/init.sql`
- 🔄 Integration: Frontend-to-backend API calls need to be implemented
- ⏳ Admin Panel: Not yet implemented
- ⏳ Production Deploy: Ready for hosting setup

### Target State

Fully functional production website with:
- Complete backend API with real data persistence
- Functional booking and contact forms
- Blog CMS with admin management
- Portfolio gallery with CMS
- Testimonial management system
- Admin authentication and dashboard
- File uploads for portfolio and testimonials
- Email notifications

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| HTML5 | - | Semantic markup |
| CSS3 | - | Styling and responsive design |
| JavaScript (Vanilla) | ES6+ | Client-side interactivity |
| Font Awesome | 6.5.1 | Icons |
| Google Fonts | - | Typography (Outfit, Zen Dots) |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | Latest | Runtime |
| Express.js | 4.18.2 | Web framework |
| PostgreSQL | 8.11.3 | Database |
| Helmet | 6.0.1 | Security headers |
| CORS | 2.8.5 | Cross-origin requests |
| dotenv | 16.0.3 | Environment variables |
| SendGrid Mail | 8.1.6 | Email service |

### Database

| Technology | Purpose |
|-----------|---------|
| PostgreSQL | Primary database (recommended in production) |
| pgcrypto | UUID generation (PostgreSQL extension) |
| Supabase | Optional hosted PostgreSQL solution |

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Browser)                       │
│  HTML/CSS/JS - Static Pages + AJAX Requests                │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/HTTPS
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend API (Node.js/Express)              │
│  Port: 3001 (development) / Process ENV (production)        │
│                                                             │
│  Routes:                                                    │
│  - GET/POST /api/booking                                   │
│  - GET/POST /api/portfolio                                 │
│  - GET/POST /api/blog                                      │
│  - GET/POST /api/contact                                   │
│  - GET/POST /api/testimonials                              │
│  - GET/POST /api/newsletter                                │
│  - POST /api/design/generate                               │
│  - POST /api/upload                                        │
│  - POST /api/auth/login                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                    TCP Connection
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database                            │
│  Host: Specified in DATABASE_URL env var                    │
│  Tables:                                                    │
│  - users (admin)                                            │
│  - portfolio_items                                          │
│  - bookings                                                 │
│  - testimonials                                             │
│  - blog_posts                                               │
│  - newsletter_subscribers                                   │
│  - design_submissions (optional)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
beapumpkintattoo/
├── index.html                          # Homepage
├── package.json                        # Root (frontend) dependencies
├── PRODUCTION_READINESS_GUIDE.md       # Comprehensive production setup guide
├── PROJECT_INSTRUCTIONS.md             # This file
├── robots.txt                          # SEO - Search engine crawling rules
├── sitemap.xml                         # SEO - Site structure map
│
├── css/
│   ├── styles.css                      # Main global styles
│   ├── about.css                       # About page styles
│   ├── blog.css                        # Blog page styles
│   ├── gallery.css                     # Gallery page styles
│   ├── ideas.css                       # Ideas page styles
│
├── js/
│   └── main.js                         # Main frontend logic (NEEDS CLEANUP)
│
├── pages/
│   ├── about.html                      # Artist biography
│   ├── blog.html                       # Blog posts listing
│   ├── gallery.html                    # Portfolio gallery
│   ├── ideas.html                      # Tattoo ideas/inspiration
│
├── routes/ (DEPRECATED - USE backend/routes/)
│   ├── auth.js
│   ├── blog.js
│   ├── booking.js
│   ├── contact.js
│   ├── design.js
│   ├── newsletter.js
│   ├── portfolio.js
│   ├── testimonials.js
│   └── upload.js
│
└── backend/
    ├── index.js                        # Express app entry point
    ├── db.js                           # PostgreSQL connection pool
    ├── package.json                    # Backend dependencies
    ├── README.md                       # Backend documentation
    │
    ├── db/
    │   └── init.sql                    # PostgreSQL schema definition
    │
    └── routes/
        ├── auth.js                     # Admin authentication
        ├── blog.js                     # Blog CRUD operations
        ├── booking.js                  # Booking management
        ├── contact.js                  # Contact form submissions
        ├── design.js                   # Design generation (AI or mock)
        ├── newsletter.js               # Newsletter subscriptions
        ├── portfolio.js                # Portfolio items CRUD
        ├── testimonials.js             # Testimonials management
        └── upload.js                   # File upload handling
```

---

## Frontend Structure

### Pages

#### [index.html](index.html) - Homepage
- Hero section with call-to-action
- Featured portfolio gallery
- Testimonials carousel
- About artist section
- Services/booking section
- Blog preview
- Contact information
- Footer with social links

**Key Sections:**
- Navigation bar with links to all pages
- Hero with anime aesthetic
- Portfolio preview (currently mock data)
- Testimonials slider (currently hardcoded)
- FAQ accordion
- Newsletter signup
- Contact information with map

**Placeholder Content to Update:**
- Phone: `+1-XXX-XXX-XXXX` (Line ~71)
- Email: `hello@beapumpkintattoo.com` (Line ~72)
- Address: `123 Anime Street, Your City` (Line ~73-77)
- Social media links (Line ~95-110)
- Coordinates: `XX.XXXXX` (Line ~79-80)

#### [pages/about.html](pages/about.html)
- Artist biography
- Experience and credentials
- Specialties
- Artist photo/portrait (placeholder)

#### [pages/blog.html](pages/blog.html)
- List of blog posts
- Blog post previews
- Search/filter functionality (mock)

#### [pages/gallery.html](pages/gallery.html)
- Portfolio gallery with filtering
- Style categories (Naruto, Dragon Ball, Studio Ghibli, etc.)
- Image zoom/lightbox
- Image descriptions

#### [pages/ideas.html](pages/ideas.html)
- Tattoo ideas inspiration
- Design concepts
- Tattoo placement suggestions
- AI-powered design generation (mock currently)

### CSS Files

- **[css/styles.css](css/styles.css)** - Global styles, layout, animations
- **[css/about.css](css/about.css)** - About page specific styles
- **[css/blog.css](css/blog.css)** - Blog page specific styles
- **[css/gallery.css](css/gallery.css)** - Gallery page specific styles
- **[css/ideas.css](css/ideas.css)** - Ideas page specific styles

### JavaScript

- **[js/main.js](js/main.js)** - Main frontend logic

**Current Functionality:**
- Mobile menu toggle
- Testimonials carousel
- Portfolio filtering
- Form submission handlers (mock)
- Design tool interaction (mock)
- Smooth scrolling

**TODO - Refactor & Integration:**
- Separate concerns (form handling in separate file)
- Implement real API calls to backend
- Remove mock responses where APIs are ready
- Add error handling for API failures
- Implement loading states

---

## Backend Structure

### Entry Point: [backend/index.js](backend/index.js)

```javascript
// Initializes Express app
// Middleware: Helmet (security), CORS, body parser
// Mounts all route handlers
// Listens on PORT (default 3001)
```

**Key Configuration:**
- Port: `process.env.PORT || 3001`
- CORS Origin: `process.env.CORS_ORIGIN || '*'` (should be restricted in production)
- Security: Helmet enabled

### Database Connection: [backend/db.js](backend/db.js)

```javascript
// PostgreSQL connection pool
// Uses pg library
// Connection string from environment variable: DATABASE_URL
// Exports query() function for all route handlers
```

**Usage in Routes:**
```javascript
const db = require('../db.js');
const result = await db.query('SELECT * FROM portfolio_items', []);
```

### Routes (`backend/routes/`)

Each route module exports an Express Router.

#### [backend/routes/auth.js](backend/routes/auth.js)
**Endpoints:**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current authenticated user

**Status:** Requires implementation

#### [backend/routes/booking.js](backend/routes/booking.js)
**Endpoints:**
- `POST /api/booking` - Submit booking request
- `GET /api/booking/:id` - Get booking details
- `GET /api/booking` - List all bookings (admin)
- `PUT /api/booking/:id` - Update booking status (admin)

**Status:** Route created, implementation pending

**Database Table:** `bookings`

#### [backend/routes/contact.js](backend/routes/contact.js)
**Endpoints:**
- `POST /api/contact` - Submit contact form

**Status:** Route created, needs email integration with SendGrid

**Database Table:** Optional (can just send email without storing)

#### [backend/routes/newsletter.js](backend/routes/newsletter.js)
**Endpoints:**
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe

**Status:** Route created, needs implementation

**Database Table:** `newsletter_subscribers`

#### [backend/routes/portfolio.js](backend/routes/portfolio.js)
**Endpoints:**
- `GET /api/portfolio` - Get all portfolio items (with pagination)
- `GET /api/portfolio/:id` - Get single portfolio item
- `POST /api/portfolio` - Create portfolio item (admin only)
- `PUT /api/portfolio/:id` - Update portfolio item (admin only)
- `DELETE /api/portfolio/:id` - Delete portfolio item (admin only)

**Status:** Route created, implementation pending

**Database Table:** `portfolio_items`

#### [backend/routes/blog.js](backend/routes/blog.js)
**Endpoints:**
- `GET /api/blog` - Get blog posts
- `GET /api/blog/:slug` - Get single blog post
- `POST /api/blog` - Create blog post (admin only)
- `PUT /api/blog/:slug` - Update blog post (admin only)
- `DELETE /api/blog/:slug` - Delete blog post (admin only)

**Status:** Route created, implementation pending

**Database Table:** `blog_posts`

#### [backend/routes/testimonials.js](backend/routes/testimonials.js)
**Endpoints:**
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit testimonial
- `GET /api/testimonials` (admin) - Get all testimonials with approval status
- `PUT /api/testimonials/:id` - Approve/reject testimonial (admin)

**Status:** Route created, implementation pending

**Database Table:** `testimonials`

#### [backend/routes/design.js](backend/routes/design.js)
**Endpoints:**
- `POST /api/design/generate` - Generate design concept

**Status:** Route created, mock implementation (generates random concepts)

**Optional API Integration:** OpenAI DALL-E, Stability AI

#### [backend/routes/upload.js](backend/routes/upload.js)
**Endpoints:**
- `POST /api/upload` - Upload file (image)

**Status:** Route created, needs file handling middleware

**Storage Options:**
- Cloudinary (recommended)
- AWS S3
- Local file system (not recommended for production)

---

## Database Structure

### Location: [backend/db/init.sql](backend/db/init.sql)

This file contains the complete PostgreSQL schema. Run this in your PostgreSQL database setup.

### Database Tables

#### `users` (Admin Accounts)
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);
```

**Purpose:** Admin authentication and authorization  
**Usage:** Admin login, role verification

#### `portfolio_items` (Tattoo Portfolio)
```sql
CREATE TABLE portfolio_items (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text,
  image_url text,
  thumbnail_url text,
  style text,
  duration text,
  size text,
  is_featured boolean DEFAULT false,
  display_order int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Purpose:** Store portfolio items with images and metadata  
**Usage:** Display on gallery page, homepage features

#### `bookings` (Appointment Requests)
```sql
CREATE TABLE bookings (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  preferred_date date,
  appointment_type text,
  anime_reference text,
  message text NOT NULL,
  reference_images text[],
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Purpose:** Store booking requests from clients  
**Usage:** Admin views/manages bookings, sends confirmation emails

**Status Values:** `pending`, `confirmed`, `completed`, `cancelled`

#### `testimonials` (Client Reviews)
```sql
CREATE TABLE testimonials (
  id uuid PRIMARY KEY,
  client_name text NOT NULL,
  client_email text NOT NULL,
  rating int CHECK (rating >= 1 AND rating <= 5),
  review text NOT NULL,
  tattoo_type text,
  avatar_url text,
  is_approved boolean DEFAULT false,
  display_order int,
  created_at timestamptz DEFAULT now()
);
```

**Purpose:** Store client testimonials with moderation  
**Usage:** Display on homepage after approval

#### `blog_posts` (Blog Content)
```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image text,
  category text,
  author_id uuid REFERENCES users(id),
  read_time int,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Purpose:** Store blog articles with rich content  
**Usage:** Blog listing and detail pages

#### `newsletter_subscribers` (Email List)
```sql
CREATE TABLE newsletter_subscribers (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now()
);
```

**Purpose:** Manage newsletter subscriptions  
**Usage:** Email marketing, audience building

#### `design_submissions` (Design Analytics)
```sql
CREATE TABLE design_submissions (
  id uuid PRIMARY KEY,
  description text,
  anime_style text,
  tattoo_style text,
  placement text,
  size text,
  color_preference text,
  session_id text,
  created_at timestamptz DEFAULT now()
);
```

**Purpose:** Track design tool usage (optional)  
**Usage:** Analytics and user behavior insights

---

## API Endpoints

### Complete API Reference

#### Authentication
```
POST /api/auth/login
  Body: { email, password }
  Response: { token, user }

POST /api/auth/logout
  Response: { ok: true }

GET /api/auth/me (requires token)
  Response: { user }
```

#### Bookings
```
POST /api/booking
  Body: { name, email, phone, preferred_date, appointment_type, anime_reference, message, reference_images }
  Response: { id, status, created_at }

GET /api/booking/:id
  Response: { booking }

GET /api/booking (admin)
  Response: { bookings: [] }

PUT /api/booking/:id (admin)
  Body: { status, notes }
  Response: { booking }
```

#### Portfolio
```
GET /api/portfolio?page=1&limit=12&category=naruto
  Response: { items: [], total, pages }

GET /api/portfolio/:id
  Response: { item }

POST /api/portfolio (admin)
  Body: { title, description, category, image_url, style, duration, size }
  Response: { id, item }

PUT /api/portfolio/:id (admin)
  Body: { title, description, ... }
  Response: { item }

DELETE /api/portfolio/:id (admin)
  Response: { ok: true }
```

#### Blog
```
GET /api/blog?page=1&limit=10
  Response: { posts: [], total, pages }

GET /api/blog/:slug
  Response: { post }

POST /api/blog (admin)
  Body: { title, slug, excerpt, content, featured_image, category }
  Response: { id, post }

PUT /api/blog/:slug (admin)
  Body: { title, excerpt, content, ... }
  Response: { post }

DELETE /api/blog/:slug (admin)
  Response: { ok: true }

PUT /api/blog/:slug/publish (admin)
  Response: { post, published_at }
```

#### Testimonials
```
GET /api/testimonials?limit=6
  Response: { testimonials: [] }

POST /api/testimonials
  Body: { client_name, client_email, rating, review, tattoo_type, avatar_url }
  Response: { id, message: 'Thank you, submitted for review' }

GET /api/testimonials (admin)
  Response: { testimonials: [], pending: 5, approved: 12 }

PUT /api/testimonials/:id (admin)
  Body: { is_approved: true, display_order: 1 }
  Response: { testimonial }
```

#### Newsletter
```
POST /api/newsletter/subscribe
  Body: { email }
  Response: { ok: true, message: 'Subscription successful' }

POST /api/newsletter/unsubscribe
  Body: { email }
  Response: { ok: true, message: 'Unsubscribed' }
```

#### Contact Form
```
POST /api/contact
  Body: { name, email, phone, message }
  Response: { ok: true, message: 'We will get back to you soon' }
```

#### Design Tool
```
POST /api/design/generate
  Body: { anime_style, tattoo_style, placement, size }
  Response: { concept: 'Generated design description' }
```

#### File Upload
```
POST /api/upload
  Body: FormData with file
  Response: { url: 'https://...', filename }
```

#### Health Check
```
GET /api/health
  Response: { ok: true }
```

---

## Development Setup

### Prerequisites

- **Node.js** v16+ ([nodejs.org](https://nodejs.org))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** v12+ (local or remote)
- **Git** ([git-scm.com](https://git-scm.com))

### Step 1: Clone & Install Dependencies

```bash
cd beapumpkintattoo

# Frontend dependencies (if needed)
npm install

# Backend dependencies
cd backend
npm install
```

### Step 2: Setup Database

#### Option A: Local PostgreSQL

```bash
# Create database
psql -U postgres
CREATE DATABASE beapumpkin_tattoo;
\c beapumpkin_tattoo

# Run schema
\i db/init.sql

# Exit
\q
```

#### Option B: Supabase (Cloud PostgreSQL)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Create new query
5. Paste contents of `backend/db/init.sql`
6. Run query
7. Get connection string from Project Settings → Database

### Step 3: Setup Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/beapumpkin_tattoo

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Email (SendGrid)
SENDGRID_API_KEY=your_api_key_here
FROM_EMAIL=noreply@beapumpkintattoo.com
ADMIN_EMAIL=admin@beapumpkintattoo.com

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# AI Design (Optional)
OPENAI_API_KEY=your_openai_key
```

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Watches for changes, auto-restarts on file changes
# API available at http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
# From root directory
# Serve static files (Option A: Use Python)
python -m http.server 3000

# Or use Node.js http-server
npm install -g http-server
http-server -p 3000
```

**Add Health Check Test:**
```bash
curl http://localhost:3001/api/health
# Response: {"ok":true}
```

---

## Environment Variables

### Required for Development

```env
# Database Connection
DATABASE_URL=postgresql://user:password@host:5432/database_name

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS (Development)
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Email Service
SENDGRID_API_KEY=SG.your_key_here
FROM_EMAIL=noreply@beapumpkintattoo.com
ADMIN_EMAIL=admin@beapumpkintattoo.com

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Authentication
JWT_SECRET=your_long_secret_key_at_least_32_characters_long
```

### Required for Production

All development variables plus:

```env
NODE_ENV=production
CORS_ORIGIN=https://beapumpkintattoo.com,https://www.beapumpkintattoo.com
ADMIN_PASSWORD_HASH=bcrypt_hashed_password
```

### Optional

```env
# AI Design Generation
OPENAI_API_KEY=sk-your_key_here
OPENAI_MODEL=dall-e-3

# Google Analytics
GA_TRACKING_ID=G-XXXXXXXXXX

# Google Calendar (for appointments)
GOOGLE_CALENDAR_ID=your_calendar_id@gmail.com
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service_account.json

# Domain Configuration
BASE_URL=https://beapumpkintattoo.com
SITE_NAME=BeaPumpkin Tattoo
```

**IMPORTANT:** Never commit `.env` file to git. Add to `.gitignore`.

---

## Key Implementation Guidelines

### Frontend to Backend Integration

#### Current Status
- Frontend: HTML/CSS/JS with mock data
- Backend: Express routes created but not implemented
- Gap: No API calls being made from frontend

#### Integration Steps

1. **Identify Current Mock Requests** (in `js/main.js`):
   - `handleBookingSubmit()` - Mock booking
   - `handleContactSubmit()` - Mock contact form
   - `loadPortfolioItems()` - Load from hardcoded array
   - `designTool` - Mock design generation

2. **Replace with Real API Calls**:
   ```javascript
   // Before (Mock)
   const response = {status: 'success', data: []};
   
   // After (Real)
   const response = await fetch('/api/booking', {
     method: 'POST',
     headers: {'Content-Type': 'application/json'},
     body: JSON.stringify(formData)
   }).then(r => r.json());
   ```

3. **Implement Error Handling**:
   ```javascript
   try {
     const response = await fetch(url);
     if (!response.ok) throw new Error(`HTTP ${response.status}`);
     return await response.json();
   } catch (error) {
     console.error('API Error:', error);
     showErrorMessage('Something went wrong. Please try again.');
   }
   ```

4. **Add Loading States**:
   ```javascript
   button.disabled = true;
   button.textContent = 'Loading...';
   // ... make API call ...
   button.disabled = false;
   ```

### Backend Implementation Guidelines

#### Route Implementation Pattern

```javascript
// backend/routes/example.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all items
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM items');
    res.json({ items: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create item
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validation
    if (!title) return res.status(400).json({ error: 'Title required' });
    
    const result = await db.query(
      'INSERT INTO items (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    
    res.status(201).json({ item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### Database Query Pattern

```javascript
// Parameterized queries (prevent SQL injection)
const result = await db.query(
  'SELECT * FROM users WHERE email = $1 AND status = $2',
  [email, 'active']
);

// Use result.rows for array, result.rows[0] for single item
```

#### Authentication Pattern

```javascript
// Add middleware to secure routes
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Use middleware
router.post('/', isAuthenticated, (req, res) => {
  // Only authenticated users can access
});
```

### File Structure Best Practices

#### Creating New Endpoint

1. Add route logic to appropriate file in `backend/routes/`
2. Test endpoint with curl or Postman
3. Document in this file
4. Add frontend integration in `js/main.js`
5. Test end-to-end

#### Adding New Page

1. Create HTML file in `pages/`
2. Create corresponding CSS file if needed in `css/`
3. Update navigation in all pages
4. Add to sitemap.xml
5. Add to robots.txt if public

---

## Deployment Information

### Hosting Platforms to Consider

#### **Option 1: Vercel + PlanetScale (Recommended for Simplicity)**
- Frontend: Vercel
- Backend: Vercel Serverless Functions
- Database: PlanetScale (MySQL) or Supabase (PostgreSQL)
- Cost: Free tier available
- Documentation: Specific setup in PRODUCTION_READINESS_GUIDE.md

#### **Option 2: Netlify + Railway/Render**
- Frontend: Netlify
- Backend: Railway or Render
- Database: PostgreSQL on Railway/Render or external
- Cost: ~$10-20/month
- Setup: See PRODUCTION_READINESS_GUIDE.md

#### **Option 3: DigitalOcean Droplet (Most Control)**
- Full VPS with all components
- Cost: $6-12/month
- Requires Linux/server knowledge
- Setup: See PRODUCTION_READINESS_GUIDE.md

### Pre-Deployment Checklist

- [ ] All environment variables secured in hosting platform
- [ ] Database backed up
- [ ] Frontend and backend tested locally
- [ ] All API endpoints working
- [ ] CORS configured for production domain
- [ ] SSL certificate setup (automatic with most platforms)
- [ ] Domain configured to point to hosting
- [ ] Email service keys valid
- [ ] File storage credentials active
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring/alerting setup

### Environment Variables for Production

See [Environment Variables](#environment-variables) section above.

### Database Migration

Use the SQL schema in `backend/db/init.sql` in your production PostgreSQL database.

---

## Common Tasks & Workflows

### Adding a New Portfolio Item

1. Admin logs in
2. POST to `/api/portfolio` with:
   - title, description, category, image_url, style, duration, size
3. Item appears on gallery page

### Publishing a Blog Post

1. Admin creates post via `/api/blog/` POST
2. Writes content (stored in database)
3. Sets `is_published = true` and `published_at = NOW()`
4. Post appears on blog page

### Processing a Booking

1. Client submits booking form
2. Stored in `bookings` table with status `pending`
3. Admin receives email notification
4. Admin reviews and updates status
5. System sends confirmation email to client

### Managing Testimonials

1. Client submits via `/api/testimonials` POST
2. Stored with `is_approved = false`
3. Admin reviews in admin panel
4. Admin sets `is_approved = true` and `display_order`
5. Testimonial appears on homepage

---

## Debugging & Troubleshooting

### Backend won't start

```bash
# Check if port is in use
lsof -i :3001

# Check environment variables
echo $DATABASE_URL

# Check database connection
psql $DATABASE_URL
```

### Database connection errors

```bash
# Verify PostgreSQL is running
psql -U postgres

# Check DATABASE_URL format
postgresql://user:password@localhost:5432/database_name
```

### CORS errors

Add to `backend/index.js`:
```javascript
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
```

Then check the value matches frontend URL.

### API endpoint returns 404

Check route is mounted in `backend/index.js`:
```javascript
app.use('/api/example', exampleRoutes);
```

---

## Additional Resources

- **Express.js:** [expressjs.com](https://expressjs.com)
- **PostgreSQL:** [postgresql.org/docs](https://postgresql.org/docs)
- **Node.js:** [nodejs.org](https://nodejs.org)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **SendGrid:** [sendgrid.com/docs](https://sendgrid.com/docs)
- **Cloudinary:** [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

**Document Version:** 1.0  
**Last Updated:** March 23, 2026  
**Maintained By:** Development Team
