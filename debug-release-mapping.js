const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugReleaseMapping() {
  console.log('🔍 Debugging release mapping...\n');
  
  // Get all releases from database
  const { data: releases, error } = await supabase
    .from('releases')
    .select('id, catalog_number, title')
    .order('catalog_number');
    
  if (error) {
    console.error('Error fetching releases:', error);
    return;
  }
  
  console.log('📀 Releases in database:');
  releases.forEach(release => {
    const oldId = parseInt(release.catalog_number.replace('AC', '').replace(/^0+/, ''));
    console.log(`  ${release.catalog_number} (Old ID: ${oldId}) → ${release.id} - ${release.title}`);
  });
  
  // Check reviews for release 2 (The Prokofiev Project)
  console.log('\n📝 Checking reviews for release 2...');
  
  const prokofievRelease = releases.find(r => {
    const oldId = parseInt(r.catalog_number.replace('AC', '').replace(/^0+/, ''));
    return oldId === 2;
  });
  
  if (prokofievRelease) {
    console.log(`Found release 2: ${prokofievRelease.id} - ${prokofievRelease.title}`);
    
    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select(`
        id,
        publication,
        reviewer_name,
        review_date,
        featured,
        review_translations(
          language,
          review_text
        )
      `)
      .eq('release_id', prokofievRelease.id);
      
    if (reviewError) {
      console.error('Error fetching reviews:', reviewError);
    } else {
      console.log(`Found ${reviews.length} reviews for this release:`);
      reviews.forEach((review, index) => {
        console.log(`  ${index + 1}. ${review.publication} by ${review.reviewer_name || 'Unknown'}`);
        console.log(`     Text: ${review.review_translations?.[0]?.review_text?.substring(0, 100)}...`);
      });
    }
  } else {
    console.log('Could not find release with old ID 2');
  }
}

debugReleaseMapping();