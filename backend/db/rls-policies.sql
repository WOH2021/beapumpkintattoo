-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE
-- Only service role can access (backend uses direct connection)
-- =====================================================
CREATE POLICY "Service role only" ON public.users
    FOR ALL
    TO authenticated, anon
    USING (false);

-- =====================================================
-- PORTFOLIO_ITEMS TABLE  
-- Public can read, only service role can write
-- =====================================================
CREATE POLICY "Public can view portfolio" ON public.portfolio_items
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Service role can manage portfolio" ON public.portfolio_items
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- BOOKINGS TABLE
-- Public can insert, only service role can read/manage
-- =====================================================
CREATE POLICY "Public can submit bookings" ON public.bookings
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Service role can manage bookings" ON public.bookings
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- TESTIMONIALS TABLE
-- Public can read approved, insert new; service role manages all
-- =====================================================
CREATE POLICY "Public can view approved testimonials" ON public.testimonials
    FOR SELECT
    TO anon, authenticated
    USING (is_approved = true);

CREATE POLICY "Public can submit testimonials" ON public.testimonials
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Service role can manage testimonials" ON public.testimonials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- BLOG_POSTS TABLE
-- Public can read published posts; service role manages all
-- =====================================================
CREATE POLICY "Public can view published posts" ON public.blog_posts
    FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

CREATE POLICY "Service role can manage posts" ON public.blog_posts
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- NEWSLETTER_SUBSCRIBERS TABLE
-- Public can insert; service role manages all
-- =====================================================
CREATE POLICY "Public can subscribe" ON public.newsletter_subscribers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Service role can manage subscribers" ON public.newsletter_subscribers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- DESIGN_SUBMISSIONS TABLE
-- Public can insert; service role manages all
-- =====================================================
CREATE POLICY "Public can submit designs" ON public.design_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Service role can manage designs" ON public.design_submissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- CONTACT_SUBMISSIONS TABLE
-- Public can insert; service role manages all
-- =====================================================
CREATE POLICY "Public can submit contact" ON public.contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Service role can manage contacts" ON public.contact_submissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- VERIFY RLS IS ENABLED
-- =====================================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'portfolio_items', 'bookings', 'testimonials', 
                  'blog_posts', 'newsletter_subscribers', 'design_submissions', 
                  'contact_submissions');
