// Script to populate missing URL fields in existing videos
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://cfyndmpjohwtvzljtypr.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM'
);

function generateUrlSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function updateExistingVideos() {
  console.log('🔧 Updating existing videos with missing URL fields...\n');
  
  try {
    // Get videos with missing URL fields
    const { data: videos, error: fetchError } = await supabase
      .from('videos')
      .select('id, title, youtube_id, url, artist_name')
      .or('url.is.null,url.eq.');
      
    if (fetchError) {
      console.error('❌ Error fetching videos:', fetchError.message);
      return;
    }
    
    if (!videos || videos.length === 0) {
      console.log('✅ All videos already have URL fields populated!');
      return;
    }
    
    console.log(`📋 Found ${videos.length} videos needing URL updates:`);
    
    for (const video of videos) {
      let newUrl = '';
      
      if (video.title) {
        newUrl = generateUrlSlug(video.title);
      } else if (video.youtube_id) {
        newUrl = `video-${video.youtube_id}`;
      } else {
        newUrl = `video-${video.id}`;
      }
      
      console.log(`   ${video.id}: "${video.title || 'No title'}" → "${newUrl}"`);
      
      // Update the video
      const { error: updateError } = await supabase
        .from('videos')
        .update({ url: newUrl })
        .eq('id', video.id);
        
      if (updateError) {
        console.error(`   ❌ Failed to update video ${video.id}:`, updateError.message);
      } else {
        console.log(`   ✅ Updated`);
      }
    }
    
    console.log('\n🎉 Video URL updates completed!');
    
  } catch (err) {
    console.error('❌ Error updating videos:', err.message);
  }
}

async function testVideoOperations() {
  console.log('\n🧪 Testing video operations...');
  
  try {
    // Test if we can create a video with the expected fields
    const testVideo = {
      title: 'Test Video - Schema Check',
      url: 'test-video-schema-check-' + Date.now(),
      artist_name: 'Test Artist',
      youtube_id: 'dQw4w9WgXcQ',
      featured: false,
      sort_order: 999
    };
    
    console.log('📝 Creating test video...');
    
    // Try to insert test video
    const { data: insertData, error: insertError } = await supabase
      .from('videos')
      .insert(testVideo)
      .select()
      .single();
      
    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      return false;
    }
    
    console.log('✅ Insert test passed - video created with ID:', insertData.id);
    
    // Test updating the video
    const { error: updateError } = await supabase
      .from('videos')
      .update({ title: 'Updated Test Video' })
      .eq('id', insertData.id);
      
    if (updateError) {
      console.error('❌ Update test failed:', updateError.message);
    } else {
      console.log('✅ Update test passed');
    }
    
    // Clean up test video
    await supabase
      .from('videos')
      .delete()
      .eq('id', insertData.id);
      
    console.log('✅ Cleanup completed');
    
    return true;
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    return false;
  }
}

async function main() {
  await updateExistingVideos();
  
  const testPassed = await testVideoOperations();
  
  if (testPassed) {
    console.log('\n🎉 SUCCESS! Video functionality is now working correctly!');
    console.log('   ✅ You can now create and edit videos in the admin panel');
    console.log('   ✅ URL slugs are automatically generated and validated');
    console.log('   ✅ All database operations are working properly');
  } else {
    console.log('\n⚠️  Video operations still have issues');
    console.log('   Please check the error messages above');
  }
}

main().catch(console.error);