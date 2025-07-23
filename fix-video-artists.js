const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cfyndmpjohwtvzljtypr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM'
);

async function fixVideoArtists() {
  console.log('=== FIXING VIDEO ARTIST RELATIONSHIPS ===\n');
  
  // Get all videos
  const { data: videos, error: videosError } = await supabase
    .from('videos')
    .select('id, title, youtube_id');
  
  if (videosError) {
    console.log('❌ Error fetching videos:', videosError.message);
    return;
  }
  
  // Get all artists
  const { data: artists, error: artistsError } = await supabase
    .from('artists')
    .select('id, name');
  
  if (artistsError) {
    console.log('❌ Error fetching artists:', artistsError.message);
    return;
  }
  
  console.log(`Found ${videos.length} videos and ${artists.length} artists\n`);
  
  // Video-to-artist mappings based on YouTube IDs and titles
  const videoArtistMappings = [
    { youtubeId: 'aHsF6g6iHy4', artistName: 'Roby Lakatos' },
    { youtubeId: 'iYSvHYKX4Ms', artistName: 'Manu Comté' },
    { youtubeId: 'tjGkbx1JA6Q', artistName: 'Roby Lakatos' },
    { youtubeId: 'RsJY-BIcLhg', artistName: 'Sergio Tiempo' },
    { youtubeId: 'rWXaVSD9mwE', artistName: 'Alexander Gurning' },
    { youtubeId: 'u_A7Tgg8zD4', artistName: 'Sergio Tiempo' },
    { youtubeId: 'pTBbGE5iBEE', artistName: 'Philippe Quint' },
    { youtubeId: 'M7D6tCB9AqA', artistName: 'Roby Lakatos' },
    { youtubeId: 'omuZF6oaCnw', artistName: 'Sergio Tiempo' },
    { youtubeId: 'wc7Lksz1aBM', artistName: 'Sergio Tiempo' },
    { youtubeId: '9U3F7yP6Mxk', artistName: 'Roby Lakatos' },
    { youtubeId: '8_oIqWuSu5o', artistName: 'Dietrich Henschel' },
    { youtubeId: '-rV5CcK1hd4', artistName: 'Martha Argerich' }
  ];
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const mapping of videoArtistMappings) {
    // Find the video
    const video = videos.find(v => v.youtube_id === mapping.youtubeId);
    if (!video) {
      console.log(`❌ Video not found for YouTube ID: ${mapping.youtubeId}`);
      errorCount++;
      continue;
    }
    
    // Find the artist (try exact match first, then partial)
    let artist = artists.find(a => a.name === mapping.artistName);
    if (!artist) {
      artist = artists.find(a => 
        a.name.toLowerCase().includes(mapping.artistName.toLowerCase()) ||
        mapping.artistName.toLowerCase().includes(a.name.toLowerCase())
      );
    }
    
    if (!artist) {
      console.log(`❌ Artist not found: ${mapping.artistName}`);
      errorCount++;
      continue;
    }
    
    // Check if relationship already exists
    const { data: existing } = await supabase
      .from('video_artists')
      .select('*')
      .eq('video_id', video.id)
      .eq('artist_id', artist.id);
    
    if (existing && existing.length > 0) {
      console.log(`ℹ️  Relationship already exists: ${video.title} -> ${artist.name}`);
      continue;
    }
    
    // Create the relationship
    const { error: insertError } = await supabase
      .from('video_artists')
      .insert({
        video_id: video.id,
        artist_id: artist.id
      });
    
    if (insertError) {
      console.log(`❌ Error creating relationship for ${video.title} -> ${artist.name}:`, insertError.message);
      errorCount++;
    } else {
      console.log(`✅ Created relationship: ${video.title} -> ${artist.name}`);
      successCount++;
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  
  // Verify the results
  console.log('\n=== VERIFICATION ===');
  const { data: finalCheck } = await supabase
    .from('video_artists')
    .select('*');
  
  console.log(`Total video-artist relationships: ${finalCheck?.length || 0}`);
}

fixVideoArtists().catch(console.error);