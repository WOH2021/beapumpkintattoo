# BeaPumpkin Tattoo — backend (Supabase)

This folder contains a minimal Node/Express API and a SQL migration to create the database schema in Supabase.

Quick steps

1. Run the SQL migration in Supabase:

   - Open your Supabase project → SQL Editor → New query
   - Copy the contents of `backend/db/init.sql` and click Run

2. Create a service DB connection string or use the project's DB connection string.
   - From Supabase → Project → Settings → Database → Connection string (URI)
   - Use that value for `DATABASE_URL` in your environment

3. Run locally:

```bash
cd backend
npm install
# create a .env with DATABASE_URL (or export it)
npm start
```

4. Deploying

- You can deploy this to Vercel, Render or Railway. Set the `DATABASE_URL` environment variable in the provider dashboard to your Supabase DB connection string.
- If you deploy to serverless (Vercel), ensure your DB allows the connection concurrency your plan supports.

Security notes

- Use the least-privileged DB user in production; avoid exposing the Supabase service_role key in the frontend.
- Prefer using Supabase's REST/API (supabase-js) and Row Level Security for public operations, and use server-side functions for admin tasks.
