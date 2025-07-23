const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateReleaseContent(releaseIdentifier, newDescription, newTracklist) {
  console.log(`📝 UPDATING RELEASE CONTENT: ${releaseIdentifier}\n`);
  
  try {
    // Find the release by ID, URL, or title
    let query = supabase.from('releases').select('id, title, url');
    
    // Try to find by ID first, then URL, then title search
    const { data: releases } = await query;
    const release = releases.find(r => 
      r.id.toString() === releaseIdentifier ||
      r.url === releaseIdentifier ||
      r.title.toLowerCase().includes(releaseIdentifier.toLowerCase())
    );
    
    if (!release) {
      console.error('❌ Release not found:', releaseIdentifier);
      console.log('Available releases:');
      releases.slice(0, 5).forEach(r => console.log(`  - ID: ${r.id}, Title: ${r.title}, URL: ${r.url}`));
      return false;
    }
    
    console.log(`✅ Found release: "${release.title}" (ID: ${release.id})`);
    
    // Check if English translation exists
    const { data: existingTranslation } = await supabase
      .from('release_translations')
      .select('id, description, tracklist')
      .eq('release_id', release.id)
      .eq('language', 'en')
      .single();
    
    if (existingTranslation) {
      // Update existing translation
      const { error: updateError } = await supabase
        .from('release_translations')
        .update({
          description: newDescription,
          tracklist: newTracklist,
          updated_at: new Date().toISOString()
        })
        .eq('release_id', release.id)
        .eq('language', 'en');
      
      if (updateError) {
        console.error('❌ Error updating translation:', updateError);
        return false;
      }
      
      console.log('✅ Updated existing English translation');
    } else {
      // Create new translation
      const { error: insertError } = await supabase
        .from('release_translations')
        .insert({
          release_id: release.id,
          language: 'en',
          description: newDescription,
          tracklist: newTracklist
        });
      
      if (insertError) {
        console.error('❌ Error creating translation:', insertError);
        return false;
      }
      
      console.log('✅ Created new English translation');
    }
    
    console.log('\n🎉 RELEASE CONTENT UPDATED SUCCESSFULLY!');
    console.log(`  • Release: ${release.title}`);
    console.log(`  • Description: ${newDescription.substring(0, 100)}...`);
    console.log(`  • Tracklist: ${newTracklist.split('\n').length} tracks`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Export for use in other scripts or direct calling
module.exports = { updateReleaseContent };

// If called directly with command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log('Usage: node update-release-content.js <releaseId> <description> <tracklist>');
    console.log('Example: node update-release-content.js "14" "New description..." "1. Track 1\\n2. Track 2"');
    process.exit(1);
  }
  
  const [releaseId, description, tracklist] = args;
  updateReleaseContent(releaseId, description, tracklist);
}