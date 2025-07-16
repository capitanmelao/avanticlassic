-- Migration: Add release_id column to videos table for linking videos to releases
-- Date: 2025-07-16
-- Fixed version - handles constraint syntax properly

-- Add release_id column to videos table
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS release_id INTEGER;

-- Drop constraint if it exists (to make migration idempotent)
ALTER TABLE public.videos DROP CONSTRAINT IF EXISTS fk_videos_release_id;

-- Add foreign key constraint
ALTER TABLE public.videos ADD CONSTRAINT fk_videos_release_id 
  FOREIGN KEY (release_id) REFERENCES public.releases(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_videos_release_id ON public.videos(release_id);

-- Add comment for documentation
COMMENT ON COLUMN public.videos.release_id IS 'Optional reference to associated release';