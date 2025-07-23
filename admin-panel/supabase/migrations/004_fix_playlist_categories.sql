-- Migration: Fix playlist category constraint to match admin panel
-- This fixes the "failed to add a playlist" error

-- Drop the existing constraint
ALTER TABLE public.playlists DROP CONSTRAINT IF EXISTS playlists_category_check;

-- Add the new constraint with the correct category values
ALTER TABLE public.playlists ADD CONSTRAINT playlists_category_check 
  CHECK (category IN ('by_artist', 'by_composer'));

-- Also add RLS policies for playlist tables (currently missing)
CREATE POLICY "Admin full access to playlists" ON public.playlists
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to playlist_translations" ON public.playlist_translations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

CREATE POLICY "Admin full access to playlist_tracks" ON public.playlist_tracks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email()
    )
  );

-- Enable RLS on these tables
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;