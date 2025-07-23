-- Migration: Fix video table schema mismatches
-- Date: 2025-07-17
-- Purpose: Add missing fields that the admin form expects

-- 1. Add missing URL slug field for website URLs
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS url TEXT;

-- 2. Add missing artist_name field for simplified artist handling
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS artist_name TEXT;

-- 3. Create unique constraint on url field (for URL slugs)
CREATE UNIQUE INDEX IF NOT EXISTS videos_url_unique ON public.videos(url) WHERE url IS NOT NULL;

-- 4. Update any existing videos to populate the url field from youtube_id
-- Generate URL slugs from titles where they exist
UPDATE public.videos 
SET url = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), ':', ''), '.', ''))
WHERE url IS NULL AND title IS NOT NULL;

-- 5. Populate artist_name from the junction table where possible
UPDATE public.videos 
SET artist_name = (
  SELECT a.name 
  FROM public.video_artists va 
  JOIN public.artists a ON va.artist_id = a.id 
  WHERE va.video_id = videos.id 
  LIMIT 1
)
WHERE artist_name IS NULL;

-- 6. Add comments for documentation
COMMENT ON COLUMN public.videos.url IS 'URL slug for the video page (e.g., "bach-goldberg-variations")';
COMMENT ON COLUMN public.videos.artist_name IS 'Artist name for simplified display (denormalized from artists table)';

-- 7. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_videos_url ON public.videos(url);
CREATE INDEX IF NOT EXISTS idx_videos_artist_name ON public.videos(artist_name);

-- 8. Update RLS policies to include new fields
DROP POLICY IF EXISTS "Admin full access to videos" ON public.videos;
CREATE POLICY "Admin full access to videos" ON public.videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

-- 9. Add validation function for URL slugs
CREATE OR REPLACE FUNCTION validate_video_url_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure URL slug is lowercase and contains only valid characters
  IF NEW.url IS NOT NULL THEN
    NEW.url = LOWER(REGEXP_REPLACE(NEW.url, '[^a-z0-9-]', '-', 'g'));
    NEW.url = REGEXP_REPLACE(NEW.url, '-+', '-', 'g');
    NEW.url = TRIM(BOTH '-' FROM NEW.url);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Add trigger to automatically format URL slugs
DROP TRIGGER IF EXISTS validate_video_url_trigger ON public.videos;
CREATE TRIGGER validate_video_url_trigger
  BEFORE INSERT OR UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION validate_video_url_slug();

-- 11. Add audit trigger for new fields
DROP TRIGGER IF EXISTS audit_videos ON public.videos;
CREATE TRIGGER audit_videos AFTER INSERT OR UPDATE OR DELETE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION log_content_changes();