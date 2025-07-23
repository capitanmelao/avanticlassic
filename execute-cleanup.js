const fetch = require('node-fetch');

async function executeCleanup() {
  try {
    console.log('🗑️ Executing mock reviews cleanup...');
    
    const response = await fetch('https://avanticlassic.vercel.app/api/admin/cleanup-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'remove_mock_reviews',
        mock_reviewer_names: ['Music Review Editor', 'Senior Classical Critic']
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ CLEANUP SUCCESSFUL!');
      console.log('📊 Results:', result);
      
      if (result.stats) {
        console.log('\n📈 CLEANUP STATISTICS:');
        console.log(`  - Reviews before: ${result.stats.total_reviews_before}`);
        console.log(`  - Mock reviews deleted: ${result.stats.mock_reviews_deleted}`);
        console.log(`  - Authentic reviews kept: ${result.stats.authentic_reviews_kept}`);
        console.log(`  - Reviews remaining: ${result.stats.reviews_remaining}`);
      }
      
      if (result.remaining_reviews && result.remaining_reviews.length > 0) {
        console.log('\n✅ REMAINING AUTHENTIC REVIEWS:');
        result.remaining_reviews.forEach(r => {
          console.log(`  - ID ${r.id}: "${r.reviewer_name}" from "${r.publication}" (Release ${r.release_id}, Rating: ${r.rating})`);
        });
      }
      
    } else {
      console.error('❌ CLEANUP FAILED:', result);
    }
    
  } catch (error) {
    console.error('❌ Error executing cleanup:', error.message);
  }
}

executeCleanup();