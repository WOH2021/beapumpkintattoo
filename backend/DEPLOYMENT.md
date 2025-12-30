# Deployment Guide

## Current Production Setup

| Component | Service | URL |
|-----------|---------|-----|
| Backend API | Render | `https://api.beapumpkintattoo.com` |
| Database | Supabase | PostgreSQL |
| Frontend | TBD | `https://beapumpkintattoo.com` |

---

## Render Configuration

### Service Settings

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Branch:** `main`

### Environment Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgres://...pooler.supabase.com:5432/postgres` | Use Session Pooler (IPv4) |
| `JWT_SECRET` | `<random-64-char-hex>` | Generate with `openssl rand -hex 32` |
| `CORS_ORIGIN` | `https://beapumpkintattoo.com` | Frontend domain |

### Generate JWT Secret

```bash
openssl rand -hex 32
```

---

## Supabase Database

### Connection String

**Important:** Render requires IPv4. Use the **Session Pooler** connection string:

```
postgres://postgres.xxxxx:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

❌ Do NOT use direct connection (IPv6 only):
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Finding Connection String

1. Supabase Dashboard → Your Project
2. Click **Connect** button (top)
3. Select **Session pooler**
4. Copy and replace `[YOUR-PASSWORD]`

---

## Troubleshooting

### TLS/SSL Issues

```bash
# Test API directly
curl -v https://api.beapumpkintattoo.com/api/health

# Check TLS certificate
openssl s_client -connect api.beapumpkintattoo.com:443 -servername api.beapumpkintattoo.com
```

### DNS Issues

```bash
nslookup api.beapumpkintattoo.com
dig +short api.beapumpkintattoo.com
```

### Database Connection Issues

If you see `ENETUNREACH` or IPv6 errors:
- Switch to Session Pooler connection string
- Verify the DATABASE_URL in Render environment

### CORS Issues

If frontend gets blocked:
1. Check `CORS_ORIGIN` matches your frontend domain exactly
2. Include protocol: `https://beapumpkintattoo.com`
3. For testing, temporarily set to `*`

### Build Errors

If "Could not read package.json":
- Ensure **Root Directory** is set to `backend` in Render

---

## Deployment Checklist

- [ ] Supabase database created
- [ ] Tables created via `init.sql`
- [ ] Seed data added
- [ ] Render service created with root dir `backend`
- [ ] `DATABASE_URL` set (Session Pooler)
- [ ] `JWT_SECRET` generated and set
- [ ] `CORS_ORIGIN` set to frontend domain
- [ ] Custom domain `api.beapumpkintattoo.com` verified
- [ ] Admin account created via `/api/auth/setup`

---

## Useful Commands

```bash
# Test health
curl -s https://api.beapumpkintattoo.com/api/health

# Test data endpoints
curl -s https://api.beapumpkintattoo.com/api/portfolio
curl -s https://api.beapumpkintattoo.com/api/testimonials

# Test booking
curl -X POST https://api.beapumpkintattoo.com/api/booking \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@test.com", "message": "Test"}'

# Admin login
curl -X POST https://api.beapumpkintattoo.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

C) If you prefer IaC: add a `render.yaml` (optional) describing `rootDir: backend` so future deploys pick the subdirectory automatically.

Local test before redeploying
```bash
cd backend
npm install
npm start
```

If local start fails because environment variables are missing, create a `.env` from `.env.example` and set `DATABASE_URL` to a valid Supabase connection string for testing.

