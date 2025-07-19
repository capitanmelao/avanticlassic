const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function removeDuplicateReviews() {
  console.log('🔍 SCANNING FOR DUPLICATE REVIEWS\n');
  
  try {
    // Get all reviews with their translations
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        release_id,
        publication,
        reviewer_name,
        review_date,
        created_at,
        review_translations(
          id,
          review_text
        )
      `)
      .order('release_id, publication, reviewer_name, created_at');
      
    if (error) {
      console.error('❌ Error fetching reviews:', error);
      return;
    }
    
    console.log(`📊 Found ${reviews.length} total reviews`);
    
    // Group reviews by potential duplicate criteria
    const grouped = {};
    reviews.forEach(review => {
      const key = `${review.release_id}-${review.publication}-${review.reviewer_name || 'null'}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(review);
    });
    
    // Find duplicates
    const duplicateGroups = Object.entries(grouped).filter(([key, revs]) => revs.length > 1);
    
    if (duplicateGroups.length === 0) {
      console.log('✅ No duplicate reviews found!');
      return;
    }
    
    console.log(`⚠️  Found ${duplicateGroups.length} groups with duplicates:\n`);
    
    let totalDuplicatesRemoved = 0;
    let translationsRemoved = 0;
    
    for (const [key, duplicates] of duplicateGroups) {
      console.log(`📋 Group: ${key} (${duplicates.length} duplicates)`);
      
      // Sort by creation date (keep the oldest one)
      duplicates.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      
      const keepReview = duplicates[0];
      const removeReviews = duplicates.slice(1);
      
      console.log(`  ✅ Keeping review ID: ${keepReview.id} (created: ${keepReview.created_at})`);
      
      for (const review of removeReviews) {
        console.log(`  🗑️  Removing review ID: ${review.id} (created: ${review.created_at})`);
        
        // Remove review translations first
        if (review.review_translations && review.review_translations.length > 0) {
          for (const translation of review.review_translations) {
            const { error: transError } = await supabase
              .from('review_translations')
              .delete()
              .eq('id', translation.id);
              
            if (transError) {
              console.error(`    ❌ Error removing translation ${translation.id}:`, transError);
            } else {
              translationsRemoved++;
              console.log(`    ✅ Removed translation ID: ${translation.id}`);
            }
          }
        }
        
        // Remove the review itself
        const { error: reviewError } = await supabase
          .from('reviews')
          .delete()
          .eq('id', review.id);
          
        if (reviewError) {
          console.error(`    ❌ Error removing review ${review.id}:`, reviewError);
        } else {
          totalDuplicatesRemoved++;
          console.log(`    ✅ Removed review ID: ${review.id}`);
        }
      }
      
      console.log('');
    }
    
    console.log(`🎉 CLEANUP COMPLETE!`);
    console.log(`  • Duplicate reviews removed: ${totalDuplicatesRemoved}`);
    console.log(`  • Review translations removed: ${translationsRemoved}`);
    console.log(`  • Duplicate groups processed: ${duplicateGroups.length}`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

removeDuplicateReviews();