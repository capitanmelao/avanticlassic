-- Migration: Create storage buckets and policies for image management
-- Date: 2025-07-16

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('artists', 'artists', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('releases', 'releases', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('playlists', 'playlists', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('videos', 'videos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('distributors', 'distributors', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for authenticated users
-- General images bucket
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'images');

CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'images');

-- Artists bucket
CREATE POLICY "Authenticated users can upload artist images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'artists');

CREATE POLICY "Authenticated users can update artist images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'artists');

CREATE POLICY "Authenticated users can delete artist images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'artists');

CREATE POLICY "Public can view artist images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'artists');

-- Releases bucket
CREATE POLICY "Authenticated users can upload release images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'releases');

CREATE POLICY "Authenticated users can update release images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'releases');

CREATE POLICY "Authenticated users can delete release images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'releases');

CREATE POLICY "Public can view release images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'releases');

-- Playlists bucket
CREATE POLICY "Authenticated users can upload playlist images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'playlists');

CREATE POLICY "Authenticated users can update playlist images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'playlists');

CREATE POLICY "Authenticated users can delete playlist images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'playlists');

CREATE POLICY "Public can view playlist images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'playlists');

-- Videos bucket
CREATE POLICY "Authenticated users can upload video images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can update video images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can delete video images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'videos');

CREATE POLICY "Public can view video images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'videos');

-- Distributors bucket
CREATE POLICY "Authenticated users can upload distributor images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'distributors');

CREATE POLICY "Authenticated users can update distributor images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'distributors');

CREATE POLICY "Authenticated users can delete distributor images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'distributors');

CREATE POLICY "Public can view distributor images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'distributors');