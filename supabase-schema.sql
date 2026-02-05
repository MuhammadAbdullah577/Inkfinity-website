-- Supabase Database Schema for Inkfinity Creation
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Inquiries Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  product_interest VARCHAR(255),
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_read ON contact_inquiries(read);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can create inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

-- Policies for authenticated users (admin)
-- NOTE: Using auth.uid() IS NOT NULL instead of auth.role() = 'authenticated'
-- because auth.role() doesn't work correctly with Supabase Auth
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage inquiries" ON contact_inquiries
  FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================================
-- RLS FIX: Run this SQL in Supabase Dashboard > SQL Editor
-- if you already have the tables created with old policies:
-- ============================================================
/*
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON products;
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can manage inquiries" ON contact_inquiries;

-- Recreate with correct auth check
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage blog posts" ON blog_posts
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage inquiries" ON contact_inquiries
  FOR ALL USING (auth.uid() IS NOT NULL);
*/

-- Create storage bucket for product images
-- Note: Run this in the Supabase Dashboard > Storage > Create new bucket
-- Bucket name: product-images
-- Public: Yes

-- Sample data (optional - uncomment to insert)
/*
INSERT INTO categories (name, slug, description) VALUES
  ('T-Shirts', 't-shirts', 'Custom printed and embroidered t-shirts'),
  ('Hoodies', 'hoodies', 'Premium quality hoodies and sweatshirts'),
  ('Polo Shirts', 'polo-shirts', 'Professional polo shirts for teams and brands'),
  ('Jackets', 'jackets', 'Custom jackets and outerwear'),
  ('Sportswear', 'sportswear', 'Athletic wear and sports uniforms'),
  ('Hats & Caps', 'hats-caps', 'Custom headwear and accessories'),
  ('Bags', 'bags', 'Custom bags and accessories'),
  ('Leather Products', 'leather-products', 'Premium leather goods'),
  ('Track Suits', 'track-suits', 'Custom track suits and athletic wear');
*/
