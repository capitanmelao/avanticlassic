-- Avanticlassic Admin CMS Database Schema
-- Execute this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_changes ENABLE ROW LEVEL SECURITY;

-- Admin Users Table (Single admin with 2FA)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL CHECK (email = 'admin@avanticlassic.com'),
  password_hash TEXT NOT NULL,
  totp_secret TEXT,
  backup_codes TEXT[10],
  last_login TIMESTAMP WITH TIME ZONE,
  failed_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artists Table (mirrors JSON structure)
CREATE TABLE IF NOT EXISTS public.artists (
  id SERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  facebook TEXT,
  image_id INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist Translations Table
CREATE TABLE IF NOT EXISTS public.artist_translations (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES public.artists(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(artist_id, language)
);

-- Releases Table (mirrors JSON structure)
CREATE TABLE IF NOT EXISTS public.releases (
  id SERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tracklist TEXT,
  shop_url TEXT,
  release_date DATE,
  catalog_number TEXT,
  image_id INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Release Artists Junction Table (many-to-many)
CREATE TABLE IF NOT EXISTS public.release_artists (
  id SERIAL PRIMARY KEY,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  artist_id INTEGER REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(release_id, artist_id)
);

-- Release Translations Table
CREATE TABLE IF NOT EXISTS public.release_translations (
  id SERIAL PRIMARY KEY,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(release_id, language)
);

-- Videos Table (simplified structure)
CREATE TABLE IF NOT EXISTS public.videos (
  id SERIAL PRIMARY KEY,
  youtube_url TEXT UNIQUE NOT NULL,
  youtube_id TEXT,
  title TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Artists Junction Table (many-to-many)
CREATE TABLE IF NOT EXISTS public.video_artists (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES public.videos(id) ON DELETE CASCADE,
  artist_id INTEGER REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(video_id, artist_id)
);

-- Video Translations Table
CREATE TABLE IF NOT EXISTS public.video_translations (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES public.videos(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(video_id, language)
);

-- Distributors Table
CREATE TABLE IF NOT EXISTS public.distributors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Changes Audit Log
CREATE TABLE IF NOT EXISTS public.content_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by UUID REFERENCES public.admin_users(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Build Status Table (for deployment tracking)
CREATE TABLE IF NOT EXISTS public.build_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'building', 'success', 'failed')),
  build_id TEXT,
  deployment_url TEXT,
  error_message TEXT,
  triggered_by UUID REFERENCES public.admin_users(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artists_featured ON public.artists(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_artists_name ON public.artists(name);
CREATE INDEX IF NOT EXISTS idx_releases_featured ON public.releases(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_releases_date ON public.releases(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON public.videos(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_content_changes_table ON public.content_changes(table_name, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_build_status_date ON public.build_status(started_at DESC);

-- Row Level Security Policies

-- Admin users can only access their own record
CREATE POLICY "Admin can only access own record" ON public.admin_users
  FOR ALL USING (auth.email() = email);

-- Only authenticated admin can access content tables
CREATE POLICY "Admin full access to artists" ON public.artists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to artist_translations" ON public.artist_translations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to releases" ON public.releases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to release_artists" ON public.release_artists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to release_translations" ON public.release_translations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to videos" ON public.videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to video_artists" ON public.video_artists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to video_translations" ON public.video_translations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to distributors" ON public.distributors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to content_changes" ON public.content_changes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to build_status" ON public.build_status
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artist_translations_updated_at BEFORE UPDATE ON public.artist_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON public.releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_release_translations_updated_at BEFORE UPDATE ON public.release_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_translations_updated_at BEFORE UPDATE ON public.video_translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distributors_updated_at BEFORE UPDATE ON public.distributors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log content changes
CREATE OR REPLACE FUNCTION log_content_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.content_changes (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_by
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    (SELECT id FROM public.admin_users WHERE email = auth.email())
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Audit triggers for content tables
CREATE TRIGGER audit_artists AFTER INSERT OR UPDATE OR DELETE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION log_content_changes();

CREATE TRIGGER audit_releases AFTER INSERT OR UPDATE OR DELETE ON public.releases
  FOR EACH ROW EXECUTE FUNCTION log_content_changes();

CREATE TRIGGER audit_videos AFTER INSERT OR UPDATE OR DELETE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION log_content_changes();

-- Storage buckets for file uploads (execute separately in Supabase Dashboard)
-- Run these in the Supabase Storage section:
-- 
-- 1. Create bucket 'artist-images' (public)
-- 2. Create bucket 'release-images' (public)  
-- 3. Create bucket 'admin-uploads' (private)
-- 
-- Storage policies will be added automatically for authenticated users