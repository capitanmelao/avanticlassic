import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action, mock_reviewer_names } = await request.json()
    
    if (action !== 'remove_mock_reviews') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    console.log('🔍 Starting cleanup of mock reviews...')

    // First, get all current reviews
    const { data: allReviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, release_id, publication, reviewer_name, rating, review_date')
      .order('id')

    if (fetchError) {
      console.error('Error fetching reviews:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    console.log(`📊 Total reviews in database: ${allReviews.length}`)

    // Identify mock reviews by reviewer name
    const mockReviews = allReviews.filter(review => 
      mock_reviewer_names.includes(review.reviewer_name)
    )

    const authenticReviews = allReviews.filter(review => 
      !mock_reviewer_names.includes(review.reviewer_name)
    )

    console.log(`❌ Mock reviews to delete: ${mockReviews.length}`)
    console.log(`✅ Authentic reviews to keep: ${authenticReviews.length}`)

    // Log authentic reviews for verification
    console.log('✅ AUTHENTIC REVIEWS TO KEEP:')
    authenticReviews.forEach(review => {
      console.log(`  - ID ${review.id}: "${review.reviewer_name}" from "${review.publication}" (Release ID: ${review.release_id})`)
    })

    let deletedCount = 0

    if (mockReviews.length > 0) {
      console.log('🗑️ Deleting mock reviews...')
      
      const mockReviewIds = mockReviews.map(r => r.id)

      // Delete review translations first (foreign key constraint)
      const { error: deleteTranslationsError } = await supabase
        .from('review_translations')
        .delete()
        .in('review_id', mockReviewIds)

      if (deleteTranslationsError) {
        console.error('Error deleting review translations:', deleteTranslationsError)
        return NextResponse.json({ 
          error: 'Failed to delete review translations',
          details: deleteTranslationsError.message 
        }, { status: 500 })
      }

      console.log('✅ Mock review translations deleted')

      // Now delete the mock reviews themselves
      const { error: deleteReviewsError } = await supabase
        .from('reviews')
        .delete()
        .in('id', mockReviewIds)

      if (deleteReviewsError) {
        console.error('Error deleting reviews:', deleteReviewsError)
        return NextResponse.json({ 
          error: 'Failed to delete reviews',
          details: deleteReviewsError.message 
        }, { status: 500 })
      }

      console.log('✅ Mock reviews deleted')
      deletedCount = mockReviews.length

      // Verify cleanup
      const { data: finalReviews, error: finalError } = await supabase
        .from('reviews')
        .select('id, release_id, publication, reviewer_name, rating')
        .order('id')

      if (finalError) {
        console.error('Error in final verification:', finalError)
        return NextResponse.json({ 
          error: 'Cleanup completed but verification failed',
          details: finalError.message 
        }, { status: 500 })
      }

      console.log(`🎉 CLEANUP COMPLETE!`)
      console.log(`📊 Reviews remaining: ${finalReviews.length}`)

      return NextResponse.json({
        success: true,
        message: 'Mock reviews cleanup completed successfully',
        stats: {
          total_reviews_before: allReviews.length,
          mock_reviews_deleted: deletedCount,
          authentic_reviews_kept: authenticReviews.length,
          reviews_remaining: finalReviews.length
        },
        remaining_reviews: finalReviews.map(r => ({
          id: r.id,
          reviewer_name: r.reviewer_name,
          publication: r.publication,
          release_id: r.release_id,
          rating: r.rating
        }))
      })
    } else {
      console.log('✅ No mock reviews found - database is already clean!')
      
      return NextResponse.json({
        success: true,
        message: 'Database is already clean - no mock reviews found',
        stats: {
          total_reviews: allReviews.length,
          mock_reviews_deleted: 0,
          authentic_reviews_kept: authenticReviews.length
        },
        remaining_reviews: authenticReviews.map(r => ({
          id: r.id,
          reviewer_name: r.reviewer_name,
          publication: r.publication,
          release_id: r.release_id,
          rating: r.rating
        }))
      })
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}