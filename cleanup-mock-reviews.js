const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://nlxpogzvjlsnnsuxsroo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5seHBvZ3p2amxzbm5zdXhzcm9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTQ4NTI5MCwiZXhwIjoyMDM3MDYxMjkwfQ.LCWKGWKmGj2fHlNf7J_MlpZZG1TUxnJ7Jqhk-FPnAW0'
)

async function cleanup() {
  console.log('🔍 Starting cleanup of mock reviews...')
  
  try {
    // First, let's see what we have
    const { data: allReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .order('id')
    
    if (fetchError) {
      console.error('Error fetching reviews:', fetchError)
      return
    }
    
    console.log(`📊 Total reviews in database: ${allReviews.length}`)
    
    // Identify mock reviews
    const mockReviews = allReviews.filter(review => 
      review.reviewer_name === 'Music Review Editor' || 
      review.reviewer_name === 'Senior Classical Critic'
    )
    
    const authenticReviews = allReviews.filter(review => 
      review.reviewer_name !== 'Music Review Editor' && 
      review.reviewer_name !== 'Senior Classical Critic'
    )
    
    console.log(`❌ Mock reviews to delete: ${mockReviews.length}`)
    console.log(`✅ Authentic reviews to keep: ${authenticReviews.length}`)
    
    // Show authentic reviews
    console.log('\n✅ AUTHENTIC REVIEWS TO KEEP:')
    authenticReviews.forEach(review => {
      console.log(`  - ID ${review.id}: "${review.reviewer_name}" from "${review.publication}" (Release ID: ${review.release_id})`)
    })
    
    // Delete mock review translations first
    if (mockReviews.length > 0) {
      console.log('\n🗑️ Deleting mock review translations...')
      const mockReviewIds = mockReviews.map(r => r.id)
      
      const { error: deleteTranslationsError } = await supabase
        .from('review_translations')
        .delete()
        .in('review_id', mockReviewIds)
      
      if (deleteTranslationsError) {
        console.error('Error deleting review translations:', deleteTranslationsError)
        return
      }
      
      console.log('✅ Mock review translations deleted')
      
      // Now delete the mock reviews themselves
      console.log('🗑️ Deleting mock reviews...')
      const { error: deleteReviewsError } = await supabase
        .from('reviews')
        .delete()
        .in('id', mockReviewIds)
      
      if (deleteReviewsError) {
        console.error('Error deleting reviews:', deleteReviewsError)
        return
      }
      
      console.log('✅ Mock reviews deleted')
    }
    
    // Verify cleanup
    const { data: finalReviews, error: finalError } = await supabase
      .from('reviews')
      .select('*')
    
    if (finalError) {
      console.error('Error in final verification:', finalError)
      return
    }
    
    console.log(`\n🎉 CLEANUP COMPLETE!`)
    console.log(`📊 Reviews remaining: ${finalReviews.length}`)
    console.log(`📊 Authentic reviews preserved`)
    
    console.log('\n📋 FINAL REVIEW INVENTORY:')
    finalReviews.forEach(review => {
      console.log(`  - ID ${review.id}: "${review.reviewer_name}" from "${review.publication}" (Release ID: ${review.release_id}, Rating: ${review.rating})`)
    })
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

cleanup()