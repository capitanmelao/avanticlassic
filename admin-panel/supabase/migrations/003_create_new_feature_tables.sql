-- Migration: Create new tables for template features
-- Phase 2: New Database Tables

-- 2.1 News System
CREATE TABLE IF NOT EXISTS public.news (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT,
  published_date DATE NOT NULL,
  featured_image TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.news_translations (
  id SERIAL PRIMARY KEY,
  news_id INTEGER REFERENCES public.news(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(news_id, language)
);

-- 2.2 Reviews System
CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  publication TEXT NOT NULL,
  reviewer_name TEXT,
  review_date DATE NOT NULL,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.review_translations (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES public.reviews(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(review_id, language)
);

-- 2.3 Newsletter System
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('active', 'unsubscribed', 'bounced')) DEFAULT 'active',
  privacy_consent BOOLEAN NOT NULL DEFAULT FALSE,
  consent_date TIMESTAMP WITH TIME ZONE NOT NULL,
  unsubscribe_token TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  ip_address INET,
  user_agent TEXT,
  language TEXT CHECK (language IN ('en', 'fr', 'de')) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id SERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sent')) DEFAULT 'draft',
  recipients_count INTEGER DEFAULT 0,
  opens_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.4 Playlists System
CREATE TABLE IF NOT EXISTS public.playlists (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('new_releases', 'for_everyone', 'moods', 'themes', 'kids', 'seasonal')),
  image_url TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.playlist_translations (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER REFERENCES public.playlists(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, language)
);

CREATE TABLE IF NOT EXISTS public.playlist_tracks (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER REFERENCES public.playlists(id) ON DELETE CASCADE,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  track_number INTEGER,
  track_title TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(playlist_id, release_id, track_number)
);

-- 2.5 Composers System
CREATE TABLE IF NOT EXISTS public.composers (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  birth_year INTEGER,
  death_year INTEGER,
  nationality TEXT,
  period TEXT CHECK (period IN ('medieval', 'renaissance', 'baroque', 'classical', 'romantic', 'modern', 'contemporary')),
  image_url TEXT,
  spotify_artist_id TEXT,
  apple_music_artist_id TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.composer_translations (
  id SERIAL PRIMARY KEY,
  composer_id INTEGER REFERENCES public.composers(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(composer_id, language)
);

CREATE TABLE IF NOT EXISTS public.release_composers (
  id SERIAL PRIMARY KEY,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  composer_id INTEGER REFERENCES public.composers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(release_id, composer_id)
);

-- 2.6 Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2.7 Static Pages
CREATE TABLE IF NOT EXISTS public.static_pages (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.static_page_translations (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES public.static_pages(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  title TEXT NOT NULL,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_id, language)
);

-- 2.8 Search Index
CREATE TABLE IF NOT EXISTS public.search_index (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('artist', 'release', 'video', 'news', 'composer', 'playlist')),
  entity_id INTEGER NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  searchable_text TSVECTOR,
  title TEXT,
  description TEXT,
  url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_type, entity_id, language)
);

-- 2.9 Analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  visitor_id TEXT,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_published_date ON public.news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);
CREATE INDEX IF NOT EXISTS idx_reviews_release_id ON public.reviews(release_id);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON public.reviews(featured);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_playlists_category ON public.playlists(category);
CREATE INDEX IF NOT EXISTS idx_composers_period ON public.composers(period);
CREATE INDEX IF NOT EXISTS idx_search_index_text ON public.search_index USING GIN(searchable_text);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_entity ON public.page_views(entity_type, entity_id);

-- Apply update triggers to new tables
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_composers_updated_at BEFORE UPDATE ON public.composers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_static_pages_updated_at BEFORE UPDATE ON public.static_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('social_media', '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}', 'Social media profile URLs'),
  ('contact_info', '{"email": "", "phone": "", "address": ""}', 'Contact information'),
  ('seo_defaults', '{"title_suffix": " | Avanti Classic", "default_description": ""}', 'Default SEO settings')
ON CONFLICT (key) DO NOTHING;