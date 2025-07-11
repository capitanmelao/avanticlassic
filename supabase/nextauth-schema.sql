-- Avanticlassic NextAuth.js Compatible Database Schema
-- Execute this in your Supabase SQL Editor

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.content_changes CASCADE;
DROP TABLE IF EXISTS public.build_status CASCADE;
DROP TABLE IF EXISTS public.video_translations CASCADE;
DROP TABLE IF EXISTS public.video_artists CASCADE;
DROP TABLE IF EXISTS public.videos CASCADE;
DROP TABLE IF EXISTS public.release_translations CASCADE;
DROP TABLE IF EXISTS public.release_artists CASCADE;
DROP TABLE IF EXISTS public.releases CASCADE;
DROP TABLE IF EXISTS public.artist_translations CASCADE;
DROP TABLE IF EXISTS public.artists CASCADE;
DROP TABLE IF EXISTS public.distributors CASCADE;
DROP TABLE IF EXISTS public.admin_sessions CASCADE;
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- Admin sessions table (for NextAuth.js tracking)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  session_token TEXT,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artists Table (enhanced from JSON structure)
CREATE TABLE IF NOT EXISTS public.artists (
  id SERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  facebook TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artist Translations Table (multilingual content)
CREATE TABLE IF NOT EXISTS public.artist_translations (
  id SERIAL PRIMARY KEY,
  artist_id INTEGER REFERENCES public.artists(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(artist_id, language)
);

-- Releases Table (enhanced from JSON structure)
CREATE TABLE IF NOT EXISTS public.releases (
  id SERIAL PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  shop_url TEXT,
  release_date DATE,
  catalog_number TEXT,
  image_url TEXT,
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

-- Release Translations Table (multilingual tracklists)
CREATE TABLE IF NOT EXISTS public.release_translations (
  id SERIAL PRIMARY KEY,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  tracklist TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(release_id, language)
);

-- Videos Table (enhanced from JSON structure)
CREATE TABLE IF NOT EXISTS public.videos (
  id SERIAL PRIMARY KEY,
  youtube_url TEXT UNIQUE NOT NULL,
  youtube_id TEXT,
  title TEXT,
  artist_name TEXT,
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

-- Video Translations Table (multilingual descriptions)
CREATE TABLE IF NOT EXISTS public.video_translations (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES public.videos(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(video_id, language)
);

-- Distributors Table (from JSON structure)
CREATE TABLE IF NOT EXISTS public.distributors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  country_id INTEGER,
  address TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Changes Audit Log (enhanced for NextAuth.js)
CREATE TABLE IF NOT EXISTS public.content_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data JSONB,
  new_data JSONB,
  changed_by_email TEXT,
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
  triggered_by_email TEXT,
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
CREATE INDEX IF NOT EXISTS idx_admin_sessions_email ON public.admin_sessions(admin_email, last_activity DESC);

-- Enable Row Level Security
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.build_status ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies (NextAuth.js compatible)
-- Note: These policies are permissive for testing, will be restricted in production

-- Admin sessions (self-access only)
CREATE POLICY "Users can access own sessions" ON public.admin_sessions
  FOR ALL USING (admin_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Content tables (admin access for Fred's email)
CREATE POLICY "Admin access to artists" ON public.artists
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to artist_translations" ON public.artist_translations
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to releases" ON public.releases
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to release_artists" ON public.release_artists
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to release_translations" ON public.release_translations
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to videos" ON public.videos
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to video_artists" ON public.video_artists
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to video_translations" ON public.video_translations
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to distributors" ON public.distributors
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to content_changes" ON public.content_changes
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
  );

CREATE POLICY "Admin access to build_status" ON public.build_status
  FOR ALL USING (
    current_setting('request.jwt.claims', true)::json->>'email' = 'carloszamalloa@gmail.com'
    OR current_setting('request.jwt.claims', true)::json->>'email' = 'fred@avanticlassic.com'
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

-- Function to log content changes (NextAuth.js compatible)
CREATE OR REPLACE FUNCTION log_content_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.content_changes (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_by_email
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
    current_setting('request.jwt.claims', true)::json->>'email'
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

-- Insert admin session tracking function
CREATE OR REPLACE FUNCTION track_admin_session(
  admin_email_param TEXT,
  session_token_param TEXT DEFAULT NULL,
  ip_address_param INET DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  INSERT INTO public.admin_sessions (
    admin_email,
    session_token,
    ip_address,
    user_agent
  ) VALUES (
    admin_email_param,
    session_token_param,
    ip_address_param,
    user_agent_param
  ) RETURNING id INTO session_id;
  
  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create test artist to verify setup
INSERT INTO public.artists (url, name, facebook) VALUES 
('test-artist', 'Test Artist', 'https://facebook.com/test')
ON CONFLICT (url) DO NOTHING;

INSERT INTO public.artist_translations (artist_id, language, description) VALUES 
(1, 'en', 'Test artist description in English')
ON CONFLICT (artist_id, language) DO NOTHING;

-- Success message
SELECT 'Avanticlassic NextAuth.js schema deployed successfully!' as message;