-- Temporarily disable RLS for testing and fix policies

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin access to artists" ON public.artists;
DROP POLICY IF EXISTS "Admin access to artist_translations" ON public.artist_translations;
DROP POLICY IF EXISTS "Admin access to releases" ON public.releases;
DROP POLICY IF EXISTS "Admin access to release_artists" ON public.release_artists;
DROP POLICY IF EXISTS "Admin access to release_translations" ON public.release_translations;
DROP POLICY IF EXISTS "Admin access to videos" ON public.videos;
DROP POLICY IF EXISTS "Admin access to video_artists" ON public.video_artists;
DROP POLICY IF EXISTS "Admin access to video_translations" ON public.video_translations;
DROP POLICY IF EXISTS "Admin access to distributors" ON public.distributors;
DROP POLICY IF EXISTS "Admin access to content_changes" ON public.content_changes;
DROP POLICY IF EXISTS "Admin access to build_status" ON public.build_status;

-- Create permissive policies for admin panel access
-- These allow full access with anon key for now, will be restricted later

CREATE POLICY "Allow anon access to artists" ON public.artists
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to artist_translations" ON public.artist_translations
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to releases" ON public.releases
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to release_artists" ON public.release_artists
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to release_translations" ON public.release_translations
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to videos" ON public.videos
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to video_artists" ON public.video_artists
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to video_translations" ON public.video_translations
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to distributors" ON public.distributors
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to content_changes" ON public.content_changes
  FOR ALL USING (true);

CREATE POLICY "Allow anon access to build_status" ON public.build_status
  FOR ALL USING (true);

-- Success message
SELECT 'RLS policies updated for admin access!' as message;