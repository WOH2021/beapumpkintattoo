Resume deployment / TLS troubleshooting

If the TLS handshake is failing when you test `https://api.beapumpkintattoo.com`, follow these steps to diagnose and resume later:

1) Quick isolation
   - Test the Render (or other host) service URL directly (bypasses DNS):
     ```bash
     curl -v https://<your-service>.onrender.com/api/health
     ```
   - If that succeeds but `api.beapumpkintattoo.com` fails, the problem is DNS or certificate issuance.

2) Check DNS (Namecheap)
   - In Namecheap → Domain List → Manage → Advanced DNS:
     - Confirm there's a CNAME record: Host `api` → Value: `<your-service>.onrender.com` (no extra dots)
     - TTL: Automatic
   - Use DNS check tools:
     ```bash
     nslookup api.beapumpkintattoo.com
     dig +short api.beapumpkintattoo.com
     ```

3) Check provider custom domain setup
   - In Render dashboard → Service → Settings → Custom Domains:
     - Confirm `api.beapumpkintattoo.com` is listed and shows "Verified".
     - If not verified, re-trigger verification (Render shows instructions).

4) Check TLS certificate issuance
   - In the host dashboard (Render) check TLS/SSL status for the custom domain.
   - If TLS failed, try removing and re-adding the domain after DNS is correct.
   - You can inspect the certificate via:
     ```bash
     openssl s_client -connect api.beapumpkintattoo.com:443 -servername api.beapumpkintattoo.com
     ```

5) Check logs on the hosting provider
   - Render → Service → Logs. Look for app errors, port binding issues, or SSL-related errors.

6) Common gotchas
   - CNAME points to the wrong hostname (typo).
   - DNS hasn't propagated yet (wait up to 30 minutes; sometimes longer).
   - Custom domain not added/verified in Render.
   - Provider requires you to add root/A records instead of CNAME for apex (we use `api` subdomain so CNAME is correct).
   - Firewall / corporate network blocking port 443 (try from a different network).

7) For temporary testing
   - Set `CORS_ORIGIN='*'` in service env vars (only for testing) and hit the service.onrender.com URL.

8) Useful commands
   ```bash
   # test provider URL
   curl -v https://<your-service>.onrender.com/api/health

   # test your domain
   curl -v https://api.beapumpkintattoo.com/api/health

   # check TLS certificate
   openssl s_client -showcerts -connect api.beapumpkintattoo.com:443 -servername api.beapumpkintattoo.com

   # DNS
   dig +nocmd api.beapumpkintattoo.com any +multiline +noall +answer
   ```

9) If the issue persists
   - Copy the exact output of `curl -v` and `openssl s_client` and save here in `DEPLOYMENT_STATUS.md` so you can pick up later.

-- Render build error: missing package.json

If Render's build log shows `Could not read package.json` (ENOENT) during `npm install`, it means Render is running commands at the repository root but your Node app lives in a subfolder (`backend/`). Fixes:

A) Preferred (Render UI - set Root Directory)
   1. Open Render dashboard → your service → Settings (or Edit Service).
   2. Set **Root Directory** (or **Root**) to `backend` and save.
   3. Keep Build Command `npm install` and Start Command `npm start`.
   4. Redeploy.

B) Quick alternative (change Build / Start commands)
   - In Render service settings set:
     - Build Command: `cd backend && npm install`
     - Start Command: `cd backend && npm start`
   - Save and redeploy.

C) If you prefer IaC: add a `render.yaml` (optional) describing `rootDir: backend` so future deploys pick the subdirectory automatically.

Local test before redeploying
```bash
cd backend
npm install
npm start
```

If local start fails because environment variables are missing, create a `.env` from `.env.example` and set `DATABASE_URL` to a valid Supabase connection string for testing.

