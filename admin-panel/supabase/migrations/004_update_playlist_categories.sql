-- Migration: Update playlist categories for By Artist/By Composer system
-- Replace existing categories with user-requested categories

-- Drop the existing check constraint
ALTER TABLE public.playlists DROP CONSTRAINT IF EXISTS playlists_category_check;

-- Add new check constraint with the requested categories
ALTER TABLE public.playlists ADD CONSTRAINT playlists_category_check 
  CHECK (category IN ('by_artist', 'by_composer'));

-- Update existing records to use new categories (if any exist)
-- Convert existing categories to new system
UPDATE public.playlists SET category = 'by_artist' WHERE category IN ('new_releases', 'for_everyone', 'themes');
UPDATE public.playlists SET category = 'by_composer' WHERE category IN ('moods', 'kids', 'seasonal');

-- Update TypeScript interface comments for reference
-- Category options are now: 'by_artist' | 'by_composer'