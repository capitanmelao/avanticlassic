const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cfyndmpjohwtvzljtypr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM'
);

async function checkVideos() {
  console.log('=== VIDEO TABLE ANALYSIS ===\n');
  
  // Check if videos table exists
  try {
    const { data: videos, error, count } = await supabase
      .from('videos')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.log('❌ Error accessing videos table:', error.message);
      return;
    }
    
    console.log(`✅ Videos table exists with ${count} records\n`);
    
    // Show sample videos
    if (videos && videos.length > 0) {
      console.log('Sample videos:');
      videos.forEach((video, index) => {
        console.log(`  ${index + 1}. ${video.title || 'No title'}`);
        console.log(`     - ID: ${video.id}`);
        console.log(`     - YouTube ID: ${video.youtube_id || 'No YouTube ID'}`);
        console.log(`     - Featured: ${video.featured}`);
        console.log(`     - Sort Order: ${video.sort_order}`);
        console.log('');
      });
    } else {
      console.log('❌ No videos found in database');
    }
    
    // Check video_artists relation
    console.log('Checking video_artists relation...');
    const { data: videoArtists, error: vaError } = await supabase
      .from('video_artists')
      .select('*')
      .limit(3);
    
    if (vaError) {
      console.log('❌ Error accessing video_artists:', vaError.message);
    } else {
      console.log(`✅ video_artists table has ${videoArtists?.length || 0} records`);
    }
    
    // Check video_translations
    console.log('Checking video_translations...');
    const { data: videoTranslations, error: vtError } = await supabase
      .from('video_translations')
      .select('*')
      .limit(3);
    
    if (vtError) {
      console.log('❌ Error accessing video_translations:', vtError.message);
    } else {
      console.log(`✅ video_translations table has ${videoTranslations?.length || 0} records`);
    }
    
    // Test the exact query from the API
    console.log('\nTesting API query...');
    const { data: apiVideos, error: apiError } = await supabase
      .from('videos')
      .select(`
        id,
        title,
        youtube_id,
        youtube_url,
        featured,
        sort_order,
        video_translations(
          language,
          description
        ),
        video_artists(
          artist:artists(
            id,
            name,
            url
          )
        )
      `)
      .order('featured', { ascending: false })
      .order('sort_order')
      .limit(5);
    
    if (apiError) {
      console.log('❌ API query error:', apiError.message);
    } else {
      console.log(`✅ API query successful, returned ${apiVideos?.length || 0} videos`);
      if (apiVideos && apiVideos.length > 0) {
        console.log('API result sample:');
        console.log(JSON.stringify(apiVideos[0], null, 2));
      }
    }
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

checkVideos().catch(console.error);