const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cfyndmpjohwtvzljtypr.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmeW5kbXBqb2h3dHZ6bGp0eXByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE0NzcxOCwiZXhwIjoyMDY3NzIzNzE4fQ.RTuzHV--VId6MAtXVUTA-FDazMbMkKsj7E72Yuj55kM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyReviewRelationships() {
  console.log('🔍 Verifying all reviews have parent releases...\n');
  
  try {
    // Get all reviews with their release information
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        id,
        release_id,
        publication,
        reviewer_name,
        releases(
          id,
          title,
          catalog_number
        )
      `)
      .order('release_id');
      
    if (error) {
      console.error('❌ Error fetching reviews:', error);
      return;
    }
    
    console.log(`📊 Total reviews in database: ${reviews.length}\n`);
    
    // Check for orphaned reviews (reviews without parent releases)
    const orphanedReviews = reviews.filter(review => !review.releases);
    
    if (orphanedReviews.length > 0) {
      console.log(`❌ Found ${orphanedReviews.length} orphaned reviews (no parent release):`);
      orphanedReviews.forEach(review => {
        console.log(`  - Review ID ${review.id}: "${review.publication}" by ${review.reviewer_name || 'Unknown'}`);
        console.log(`    Release ID: ${review.release_id} (NOT FOUND)`);
      });
    } else {
      console.log('✅ All reviews have valid parent releases!');
    }
    
    // Group reviews by release
    const reviewsByRelease = {};
    reviews.forEach(review => {
      if (review.releases) {
        const releaseId = review.releases.id;
        if (!reviewsByRelease[releaseId]) {
          reviewsByRelease[releaseId] = {
            release: review.releases,
            reviews: []
          };
        }
        reviewsByRelease[releaseId].reviews.push(review);
      }
    });
    
    console.log(`\n📀 Reviews distribution across ${Object.keys(reviewsByRelease).length} releases:`);
    
    Object.values(reviewsByRelease)
      .sort((a, b) => parseInt(a.release.catalog_number.replace('AC', '')) - parseInt(b.release.catalog_number.replace('AC', '')))
      .forEach(({ release, reviews }) => {
        console.log(`  ${release.catalog_number}: ${reviews.length} reviews - "${release.title}"`);
        reviews.forEach(review => {
          console.log(`    • ${review.publication} ${review.reviewer_name ? `by ${review.reviewer_name}` : ''}`);
        });
      });
    
    // Summary statistics
    const totalReleases = Object.keys(reviewsByRelease).length;
    const totalReviews = reviews.filter(r => r.releases).length;
    const avgReviewsPerRelease = (totalReviews / totalReleases).toFixed(1);
    
    console.log(`\n📈 Summary:`);
    console.log(`  • Total releases with reviews: ${totalReleases}`);
    console.log(`  • Total valid reviews: ${totalReviews}`);
    console.log(`  • Average reviews per release: ${avgReviewsPerRelease}`);
    console.log(`  • Orphaned reviews: ${orphanedReviews.length}`);
    
    if (orphanedReviews.length === 0) {
      console.log('\n🎉 SUCCESS: Every review has a valid parent release!');
    } else {
      console.log(`\n⚠️  WARNING: ${orphanedReviews.length} reviews need to be fixed!`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyReviewRelationships();