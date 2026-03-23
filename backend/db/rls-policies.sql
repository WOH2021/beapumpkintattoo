-- BeaPumpkin Tattoo - Row Level Security (RLS) Policies
-- Run this in the Supabase SQL editor after running init.sql
-- This secures all public tables exposed via PostgREST

-- ============================================================
-- STEP 1: LEGACY CLEANUP
-- ============================================================
-- Note: customer_references and quote_requests tables have been removed
-- from the schema. If they still exist in your database, you can manually
-- DROP them with:
-- DROP TABLE IF EXISTS public.customer_references CASCADE;
-- DROP TABLE IF EXISTS public.quote_requests CASCADE;

-- ============================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ============================================================

-- Users table - Admin only
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Portfolio items - Public read, admin write
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- Bookings - User can see own, admin sees all
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Testimonials - Public read approved, user read own, admin full access
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Blog posts - Public read published, admin full access
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Newsletter subscribers - Admin only
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Contact submissions - Admin only (contains PII: email, name)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: CREATE RLS POLICIES
-- ============================================================

-- ===== USERS TABLE (Admin Only) =====
CREATE POLICY "Users: Authenticated users can read own record" 
ON public.users FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Users: Admin can read all" 
ON public.users FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- ===== PORTFOLIO ITEMS (Public Read, Admin Write) =====
CREATE POLICY "Portfolio: Public read all" 
ON public.portfolio_items FOR SELECT 
USING (true);

CREATE POLICY "Portfolio: Admin insert only" 
ON public.portfolio_items FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Portfolio: Admin update only" 
ON public.portfolio_items FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Portfolio: Admin delete only" 
ON public.portfolio_items FOR DELETE 
USING (auth.jwt() ->> 'role' = 'admin');

-- ===== BOOKINGS (User sees own, Admin sees all) =====
CREATE POLICY "Bookings: Users can create" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Bookings: Users can read own bookings" 
ON public.bookings FOR SELECT 
USING (
  email = current_setting('request.jwt.claims', true)::json->>'email' 
  OR auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Bookings: Admin can update all" 
ON public.bookings FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

-- ===== TESTIMONIALS (Public read approved, User read own, Admin full) =====
CREATE POLICY "Testimonials: Public read approved" 
ON public.testimonials FOR SELECT 
USING (
  is_approved = true 
  OR auth.jwt() ->> 'role' = 'admin'
  OR client_email = current_setting('request.jwt.claims', true)::json->>'email'
);

CREATE POLICY "Testimonials: Anyone can insert" 
ON public.testimonials FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Testimonials: Admin can update" 
ON public.testimonials FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

-- ===== BLOG POSTS (Public read published, Admin full) =====
CREATE POLICY "Blog: Public read published" 
ON public.blog_posts FOR SELECT 
USING (
  is_published = true 
  OR auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Blog: Admin insert only" 
ON public.blog_posts FOR INSERT 
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Blog: Admin update only" 
ON public.blog_posts FOR UPDATE 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Blog: Admin delete only" 
ON public.blog_posts FOR DELETE 
USING (auth.jwt() ->> 'role' = 'admin');

-- ===== NEWSLETTER SUBSCRIBERS (Admin only) =====
CREATE POLICY "Newsletter: Anyone can insert" 
ON public.newsletter_subscribers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Newsletter: Admin can read" 
ON public.newsletter_subscribers FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- ===== CONTACT SUBMISSIONS (Admin only - Contains PII) =====
CREATE POLICY "Contact: Anyone can insert" 
ON public.contact_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Contact: Admin can read" 
ON public.contact_submissions FOR SELECT 
USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================
-- STEP 4: VERIFY RLS IS ENABLED
-- ============================================================
-- Run this query to verify:
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%';
