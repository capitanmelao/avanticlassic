-- Fix the artists table sequence after data migration
-- This ensures new insertions get proper IDs

-- Reset the sequence to the correct value
SELECT setval('artists_id_seq', (SELECT MAX(id) FROM artists));

-- Verify the sequence is correct
SELECT currval('artists_id_seq') as current_sequence_value;

-- Check next value that will be generated
SELECT nextval('artists_id_seq') as next_id_will_be;

-- Reset sequence back to correct position
SELECT setval('artists_id_seq', (SELECT MAX(id) FROM artists));

SELECT 'Artists sequence fixed!' as message;