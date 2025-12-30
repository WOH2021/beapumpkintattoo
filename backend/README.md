# BeaPumpkin Tattoo — Backend API

Node.js/Express API for the BeaPumpkin Tattoo website, connected to Supabase PostgreSQL.

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Auth:** JWT (jsonwebtoken + bcrypt)
- **Hosting:** Render

## API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/portfolio` | Get all portfolio items |
| GET | `/api/portfolio/:id` | Get single portfolio item |
| GET | `/api/testimonials` | Get approved testimonials |
| POST | `/api/testimonials` | Submit a testimonial |
| GET | `/api/blog` | Get published blog posts |
| GET | `/api/blog/:slug` | Get single blog post |
| POST | `/api/booking` | Submit booking request |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/newsletter` | Subscribe to newsletter |

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/setup` | Create first admin (one-time) |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/logout` | Admin logout |
| GET | `/api/auth/me` | Get current user |

### Protected Endpoints (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/portfolio` | Create portfolio item |
| PUT | `/api/portfolio/:id` | Update portfolio item |
| DELETE | `/api/portfolio/:id` | Delete portfolio item |
| POST | `/api/blog` | Create blog post |
| PUT | `/api/blog/:slug` | Update blog post |
| PUT | `/api/testimonials/:id` | Approve/reject testimonial |
| GET | `/api/contact` | View contact submissions |
| PUT | `/api/contact/:id` | Mark as read |

## Setup

### 1. Database Setup (Supabase)

```bash
# Run the SQL migration in Supabase SQL Editor
# Copy contents of: backend/db/init.sql
```

### 2. Environment Variables

Create `.env` file:

```env
PORT=3001
DATABASE_URL=postgres://postgres.xxx:[PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://beapumpkintattoo.com
```

**Important:** Use Supabase **Session Pooler** URL (supports IPv4)

### 3. Run Locally

```bash
cd backend
npm install
npm run dev   # with nodemon
npm start     # production
```

### 4. Deploy to Render

1. Connect GitHub repo
2. Set **Root Directory** to `backend`
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `npm start`
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGIN`

## Project Structure

```
backend/
├── index.js           # Express app entry point
├── db.js              # Database connection pool
├── package.json
├── middleware/
│   └── auth.js        # JWT authentication middleware
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── blog.js        # Blog CRUD
│   ├── booking.js     # Booking submissions
│   ├── contact.js     # Contact form
│   ├── design.js      # Design tool (stub)
│   ├── newsletter.js  # Newsletter subscriptions
│   ├── portfolio.js   # Portfolio CRUD
│   ├── testimonials.js # Testimonials CRUD
│   └── upload.js      # File uploads (stub)
└── db/
    └── init.sql       # Database schema
```

## Authentication

### Initial Setup

```bash
curl -X POST https://api.beapumpkintattoo.com/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "secure-password", "name": "Admin"}'
```

### Login

```bash
curl -X POST https://api.beapumpkintattoo.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "secure-password"}'
```

### Using Protected Endpoints

```bash
curl -X POST https://api.beapumpkintattoo.com/api/portfolio \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "New Tattoo", "category": "Anime"}'
```

## Security Notes

- All admin routes require JWT authentication
- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire in 24 hours
- CORS is configured to only allow the frontend origin
- Use Supabase Row Level Security for additional protection
