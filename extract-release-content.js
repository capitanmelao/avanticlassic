const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listAllReleases() {
  console.log('📋 CURRENT RELEASES IN DATABASE:\n');
  
  try {
    const { data: releases } = await supabase
      .from('releases')
      .select(`
        id,
        title,
        url,
        release_translations(
          language,
          description,
          tracklist
        )
      `)
      .order('id');
    
    releases.forEach((release, index) => {
      console.log(`${index + 1}. "${release.title}" (ID: ${release.id})`);
      console.log(`   URL: ${release.url || 'No URL'}`);
      
      const enTranslation = release.release_translations?.find(t => t.language === 'en');
      if (enTranslation) {
        console.log(`   Description: ${enTranslation.description ? 'EXISTS' : 'MISSING'} (${enTranslation.description?.length || 0} chars)`);
        console.log(`   Tracklist: ${enTranslation.tracklist ? 'EXISTS' : 'MISSING'} (${enTranslation.tracklist?.split('\n').length || 0} tracks)`);
      } else {
        console.log(`   Translation: MISSING`);
      }
      console.log('');
    });
    
    console.log(`Total releases: ${releases.length}`);
    
  } catch (error) {
    console.error('❌ Error fetching releases:', error);
  }
}

async function extractContentFromOriginalSite(releaseUrls) {
  console.log('🔍 EXTRACTING CONTENT FROM ORIGINAL SITE:\n');
  
  // This function can be expanded to fetch content from original site
  // For now, it will help organize the manual process
  
  for (const url of releaseUrls) {
    try {
      console.log(`Checking: ${url}`);
      // Here we could add web scraping logic if needed
      // For now, we'll work with manual input
      
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
    }
  }
}

// Function to batch update multiple releases
async function batchUpdateReleases(updates) {
  console.log('🔄 BATCH UPDATING RELEASES:\n');
  
  for (const update of updates) {
    const { releaseId, description, tracklist } = update;
    
    try {
      const { updateReleaseContent } = require('./update-release-content.js');
      const success = await updateReleaseContent(releaseId, description, tracklist);
      
      if (success) {
        console.log(`✅ Updated release ${releaseId}`);
      } else {
        console.log(`❌ Failed to update release ${releaseId}`);
      }
      
    } catch (error) {
      console.error(`Error updating release ${releaseId}:`, error.message);
    }
  }
}

// Export functions
module.exports = {
  listAllReleases,
  extractContentFromOriginalSite,
  batchUpdateReleases
};

// If called directly, list all releases
if (require.main === module) {
  listAllReleases();
}