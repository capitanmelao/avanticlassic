-- Migration: Add by_theme category to playlist constraint
-- Adds the third category as requested by user

-- Drop the existing check constraint
ALTER TABLE public.playlists DROP CONSTRAINT IF EXISTS playlists_category_check;

-- Add new check constraint with all three categories
ALTER TABLE public.playlists ADD CONSTRAINT playlists_category_check 
  CHECK (category IN ('by_artist', 'by_composer', 'by_theme'));

-- Add comment for clarity
COMMENT ON COLUMN public.playlists.category IS 'Playlist category: by_artist, by_composer, or by_theme';