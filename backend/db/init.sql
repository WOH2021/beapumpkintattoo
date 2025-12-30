-- Supabase / Postgres schema for BeaPumpkin Tattoo
-- Run this in the Supabase SQL editor (SQL Editor → New query → Run)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users (admin)
CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  role text DEFAULT 'admin',
  created_at timestamptz DEFAULT now()
);

-- Portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name text NOT NULL,
  client_email text,
  rating int CHECK (rating >= 1 AND rating <= 5),
  review text NOT NULL,
  tattoo_type text,
  avatar_url text,
  is_approved boolean DEFAULT false,
  display_order int,
  created_at timestamptz DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now()
);

-- Design submissions (optional)
CREATE TABLE IF NOT EXISTS design_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  description text,
  anime_style text,
  tattoo_style text,
  placement text,
  size text,
  color_preference text,
  session_id text,
  created_at timestamptz DEFAULT now()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
