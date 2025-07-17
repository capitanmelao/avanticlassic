-- Migration: Fix youtube_url constraint issue
-- Date: 2025-07-17
-- Purpose: Fix NOT NULL constraint on youtube_url column

-- 1. Remove NOT NULL constraint from youtube_url (it can be generated from youtube_id)
ALTER TABLE public.videos ALTER COLUMN youtube_url DROP NOT NULL;

-- 2. Update existing records to populate youtube_url from youtube_id where missing
UPDATE public.videos 
SET youtube_url = 'https://www.youtube.com/watch?v=' || youtube_id
WHERE youtube_url IS NULL AND youtube_id IS NOT NULL;

-- 3. Add a trigger to automatically populate youtube_url when youtube_id is provided
CREATE OR REPLACE FUNCTION populate_youtube_url()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-populate youtube_url from youtube_id if not provided
  IF NEW.youtube_id IS NOT NULL AND (NEW.youtube_url IS NULL OR NEW.youtube_url = '') THEN
    NEW.youtube_url = 'https://www.youtube.com/watch?v=' || NEW.youtube_id;
  END IF;
  
  -- Auto-populate thumbnail_url if not provided
  IF NEW.youtube_id IS NOT NULL AND (NEW.thumbnail_url IS NULL OR NEW.thumbnail_url = '') THEN
    NEW.thumbnail_url = 'https://img.youtube.com/vi/' || NEW.youtube_id || '/maxresdefault.jpg';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Add trigger to automatically populate youtube fields
DROP TRIGGER IF EXISTS populate_youtube_fields ON public.videos;
CREATE TRIGGER populate_youtube_fields
  BEFORE INSERT OR UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION populate_youtube_url();