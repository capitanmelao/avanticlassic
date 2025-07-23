const { createClient } = require('@supabase/supabase-js')

// Use the same credentials from the admin panel
const supabaseUrl = 'https://nlxpogzvjlsnnsuxsroo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5seHBvZ3p2amxzbm5zdXhzcm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE0ODUyOTAsImV4cCI6MjAzNzA2MTI5MH0.9QJFZ5TdV9dKKzjFFwCY8Ck4rrIJxXZbTdGVXCe2EjM'

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanup() {
  console.log('🔍 Starting mock reviews cleanup...')
  
  try {
    // Check current reviews
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, release_id, publication, reviewer_name, rating')
      .order('id')

    if (fetchError) {
      console.error('Error:', fetchError.message)
      return
    }

    console.log(`📊 Total reviews: ${reviews.length}`)
    
    // Show all current reviews
    console.log('\n📋 CURRENT REVIEWS:')
    reviews.forEach(r => {
      console.log(`  ID ${r.id}: "${r.reviewer_name}" from "${r.publication}" (Release ${r.release_id}, Rating: ${r.rating})`)
    })

    // Identify mock reviews (generic reviewer names)
    const mockReviews = reviews.filter(r => 
      r.reviewer_name === 'Music Review Editor' || 
      r.reviewer_name === 'Senior Classical Critic'
    )

    const realReviews = reviews.filter(r => 
      r.reviewer_name !== 'Music Review Editor' && 
      r.reviewer_name !== 'Senior Classical Critic'
    )

    console.log(`\n❌ Mock reviews to delete: ${mockReviews.length}`)
    console.log(`✅ Real reviews to keep: ${realReviews.length}`)

    if (realReviews.length > 0) {
      console.log('\n✅ REAL REVIEWS TO KEEP:')
      realReviews.forEach(r => {
        console.log(`  ID ${r.id}: "${r.reviewer_name}" from "${r.publication}" (Release ${r.release_id})`)
      })
    }

    if (mockReviews.length > 0) {
      console.log('\n🗑️ MOCK REVIEWS TO DELETE:')
      mockReviews.forEach(r => {
        console.log(`  ID ${r.id}: "${r.reviewer_name}" from "${r.publication}" (Release ${r.release_id})`)
      })

      // Delete mock review translations first  
      const mockIds = mockReviews.map(r => r.id)
      
      const { error: delTransError } = await supabase
        .from('review_translations')
        .delete()
        .in('review_id', mockIds)
        
      if (delTransError) {
        console.error('Error deleting translations:', delTransError.message)
        return
      }
      
      console.log('✅ Deleted mock review translations')

      // Then delete the reviews themselves
      const { error: delReviewError } = await supabase
        .from('reviews')
        .delete()
        .in('id', mockIds)
        
      if (delReviewError) {
        console.error('Error deleting reviews:', delReviewError.message)
        return
      }
      
      console.log('✅ Deleted mock reviews')

      // Final verification
      const { data: finalReviews } = await supabase
        .from('reviews')
        .select('id, release_id, publication, reviewer_name, rating')
        
      console.log(`\n🎉 CLEANUP COMPLETE!`)
      console.log(`📊 Reviews remaining: ${finalReviews.length}`)
      
      if (finalReviews.length > 0) {
        console.log('\n📋 FINAL REMAINING REVIEWS:')
        finalReviews.forEach(r => {
          console.log(`  ID ${r.id}: "${r.reviewer_name}" from "${r.publication}" (Release ${r.release_id}, Rating: ${r.rating})`)
        })
      }
    } else {
      console.log('\n✅ No mock reviews found - database is clean!')
    }

  } catch (error) {
    console.error('Script error:', error)
  }
}

cleanup()