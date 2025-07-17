-- Migration: Add missing URL column to videos table
-- Date: 2025-07-17
-- Purpose: Add the missing URL slug field that the admin form expects

-- 1. Add missing URL slug field for website URLs (this is the main missing piece)
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS url TEXT;

-- 2. Create unique constraint on url field (for URL slugs)
CREATE UNIQUE INDEX IF NOT EXISTS videos_url_unique ON public.videos(url) WHERE url IS NOT NULL;

-- 3. Update existing videos to populate the url field from titles
-- Generate URL slugs from titles where they exist
UPDATE public.videos 
SET url = LOWER(
  TRIM(
    BOTH '-' FROM 
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(title, '[^a-zA-Z0-9\s\-]', '', 'g'), 
        '\s+', '-', 'g'
      ), 
      '-+', '-', 'g'
    )
  )
)
WHERE url IS NULL AND title IS NOT NULL AND title != '';

-- 4. For videos without titles, generate URL from youtube_id
UPDATE public.videos 
SET url = 'video-' || youtube_id
WHERE url IS NULL AND youtube_id IS NOT NULL;

-- 5. Add comments for documentation
COMMENT ON COLUMN public.videos.url IS 'URL slug for the video page (e.g., "bach-goldberg-variations")';

-- 6. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_videos_url ON public.videos(url);

-- 7. Add validation function for URL slugs
CREATE OR REPLACE FUNCTION validate_video_url_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure URL slug is lowercase and contains only valid characters
  IF NEW.url IS NOT NULL THEN
    NEW.url = LOWER(
      TRIM(
        BOTH '-' FROM 
        REGEXP_REPLACE(
          REGEXP_REPLACE(NEW.url, '[^a-z0-9\-]', '-', 'g'), 
          '-+', '-', 'g'
        )
      )
    );
    
    -- Ensure URL is not empty after cleaning
    IF NEW.url = '' OR NEW.url IS NULL THEN
      NEW.url = 'video-' || NEW.youtube_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Add trigger to automatically format URL slugs
DROP TRIGGER IF EXISTS validate_video_url_trigger ON public.videos;
CREATE TRIGGER validate_video_url_trigger
  BEFORE INSERT OR UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION validate_video_url_slug();

-- 9. Update RLS policy (using Supabase auth instead of admin_users table)
DROP POLICY IF EXISTS "Admin full access to videos" ON public.videos;

-- Check if RLS is enabled, if not enable it
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policy allowing authenticated users full access
CREATE POLICY "Authenticated users full access to videos" ON public.videos
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Also allow service role access
CREATE POLICY "Service role full access to videos" ON public.videos
  FOR ALL 
  TO service_role 
  USING (true)
  WITH CHECK (true);