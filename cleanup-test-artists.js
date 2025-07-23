const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupTestArtists() {
  console.log('🧹 CLEANING UP TEST ARTIST DATA\\n');
  
  try {
    // 1. Find the Test Artist
    const { data: testArtist, error: findError } = await supabase
      .from('artists')
      .select('id')
      .eq('name', 'Test Artist')
      .single();
      
    if (findError) {
      console.log('✅ No Test Artist found, nothing to clean');
      return;
    }
    
    console.log(`🎯 Found Test Artist with ID: ${testArtist.id}`);
    
    // 2. Find all releases linked to Test Artist  
    const { data: releases, error: releasesError } = await supabase
      .from('release_artists')
      .select('release_id, release:releases(id, catalog_number, title)')
      .eq('artist_id', testArtist.id);
      
    if (releasesError) {
      console.error('❌ Error finding linked releases:', releasesError);
      return;
    }
    
    console.log(`📀 Found ${releases.length} releases linked to Test Artist:`);
    releases.forEach(r => {
      console.log(`  • ${r.release.catalog_number}: ${r.release.title}`);
    });
    
    // 3. Remove all release_artists links to Test Artist
    const { error: deleteLinksError } = await supabase
      .from('release_artists')
      .delete()
      .eq('artist_id', testArtist.id);
      
    if (deleteLinksError) {
      console.error('❌ Error removing artist links:', deleteLinksError);
      return;
    }
    
    console.log(`✅ Removed ${releases.length} artist links`);
    
    // 4. Delete the Test Artist record
    const { error: deleteArtistError } = await supabase
      .from('artists')
      .delete()
      .eq('id', testArtist.id);
      
    if (deleteArtistError) {
      console.error('❌ Error deleting Test Artist:', deleteArtistError);
      return;
    }
    
    console.log('✅ Deleted Test Artist record');
    console.log('\\n🎉 Cleanup complete! Ready for full migration.');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupTestArtists();