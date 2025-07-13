-- Check current database schema
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('artists', 'releases', 'videos', 'distributors', 'artist_translations', 'release_translations', 'release_artists')
ORDER BY table_name, ordinal_position;