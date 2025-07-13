-- Migration: Update existing tables with missing fields for template integration
-- Phase 1: Database Schema Updates

-- 1.1 Update Artists Table
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS instrument TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS twitter TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS youtube TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS spotify_artist_id TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS apple_music_artist_id TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.artists ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- 1.2 Update Releases Table
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS format TEXT CHECK (format IN ('CD', 'SACD', 'Vinyl', 'Digital', 'Cassette'));
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS spotify_url TEXT;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS apple_music_url TEXT;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS youtube_music_url TEXT;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS amazon_music_url TEXT;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS bandcamp_url TEXT;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS soundcloud_url TEXT;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.releases ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add description to release_translations
ALTER TABLE public.release_translations ADD COLUMN IF NOT EXISTS description TEXT;

-- 1.3 Update Videos Table
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS published_date DATE;

-- 1.4 Update Video Descriptions to use separate table (if not already done)
CREATE TABLE IF NOT EXISTS public.video_descriptions (
  id SERIAL PRIMARY KEY,
  video_id INTEGER NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'fr', 'de')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(video_id, language)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artists_instrument ON public.artists(instrument);
CREATE INDEX IF NOT EXISTS idx_releases_format ON public.releases(format);
CREATE INDEX IF NOT EXISTS idx_videos_published_date ON public.videos(published_date DESC);

-- Add triggers to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that have updated_at
DROP TRIGGER IF EXISTS update_artists_updated_at ON public.artists;
CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON public.artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_releases_updated_at ON public.releases;
CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON public.releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON public.videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON COLUMN public.artists.instrument IS 'Musical instrument or voice type (e.g., Piano, Violin, Baritone, Ensemble)';
COMMENT ON COLUMN public.artists.spotify_artist_id IS 'Spotify artist ID for linking to Spotify profile';
COMMENT ON COLUMN public.artists.apple_music_artist_id IS 'Apple Music artist ID for linking to Apple Music profile';

COMMENT ON COLUMN public.releases.format IS 'Physical or digital format of the release';
COMMENT ON COLUMN public.release_translations.description IS 'Long-form description of the release in the specified language';

COMMENT ON COLUMN public.videos.thumbnail_url IS 'Custom thumbnail URL, defaults to YouTube thumbnail if not specified';
COMMENT ON COLUMN public.videos.duration IS 'Video duration in seconds';
COMMENT ON COLUMN public.videos.view_count IS 'Number of views for analytics';