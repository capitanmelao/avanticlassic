import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action !== 'update_review_dates') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    console.log('📅 Updating review dates to be more realistic...')

    // Get all current reviews
    const { data: reviews, error: fetchError } = await supabase
      .from('reviews')
      .select('id, release_id, publication, reviewer_name, review_date')
      .order('id')

    if (fetchError) {
      console.error('Error fetching reviews:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    // More realistic review dates (within last 2-3 years for active reviews)
    const dateUpdates = [
      // Fire Dance reviews (Release 1)
      { release_id: 1, reviewer_name: 'Elena Rodriguez', new_date: '2023-03-15' },
      { release_id: 1, reviewer_name: 'André Laurent', new_date: '2023-02-28' },
      
      // Liszt Totentanz reviews (Release 13)  
      { release_id: 13, reviewer_name: 'Sarah Johnson', new_date: '2023-11-10' },
      { release_id: 13, reviewer_name: 'David Martinez', new_date: '2023-10-22' },
      
      // Forgotten Melodies reviews (Release 15)
      { release_id: 15, reviewer_name: 'Michael Cookson', new_date: '2024-01-15' },
      { release_id: 15, reviewer_name: 'John Theraud', new_date: '2023-12-08' },
      { release_id: 15, reviewer_name: 'Zan Furtwangler', new_date: '2024-02-03' },
      
      // Homilia review (Release 25)
      { release_id: 25, reviewer_name: 'Michael Cookson', new_date: '2023-09-12' },
      
      // Legacy reviews (Release 26)
      { release_id: 26, reviewer_name: 'Dominy Clements', new_date: '2024-03-18' },
      { release_id: 26, reviewer_name: 'Patrick Rucker', new_date: '2024-04-05' }
    ]

    let updatedCount = 0

    for (const update of dateUpdates) {
      const reviewToUpdate = reviews.find(r => 
        r.release_id === update.release_id && r.reviewer_name === update.reviewer_name
      )

      if (reviewToUpdate) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ review_date: update.new_date })
          .eq('id', reviewToUpdate.id)

        if (updateError) {
          console.error(`Error updating review ${reviewToUpdate.id}:`, updateError)
        } else {
          console.log(`✅ Updated review by ${update.reviewer_name} to ${update.new_date}`)
          updatedCount++
        }
      }
    }

    // Verify updates
    const { data: finalReviews, error: finalError } = await supabase
      .from('reviews')
      .select('id, release_id, publication, reviewer_name, review_date')
      .order('review_date desc')

    if (finalError) {
      console.error('Error verifying updates:', finalError)
      return NextResponse.json({ 
        error: 'Updates completed but verification failed',
        details: finalError.message 
      }, { status: 500 })
    }

    console.log(`🎉 DATE UPDATE COMPLETE!`)
    console.log(`📊 Reviews updated: ${updatedCount}`)

    return NextResponse.json({
      success: true,
      message: 'Review dates updated successfully',
      stats: {
        total_reviews: finalReviews.length,
        reviews_updated: updatedCount
      },
      updated_reviews: finalReviews.map(r => ({
        id: r.id,
        release_id: r.release_id,
        reviewer_name: r.reviewer_name,
        publication: r.publication,
        review_date: r.review_date
      }))
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}