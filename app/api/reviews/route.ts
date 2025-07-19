import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    
    // Get featured parameter to filter only featured reviews
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    
    let query = supabase
      .from('reviews')
      .select(`
        *,
        releases (
          id,
          title,
          image_url,
          catalog_number
        )
      `)
      .order('review_date', { ascending: false })

    // Filter by featured if requested
    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    // Add limit if specified
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    // Transform data to match frontend interface
    const transformedReviews = reviews?.map(review => ({
      id: review.id.toString(),
      publication: review.publication,
      reviewerName: review.reviewer_name,
      reviewDate: review.review_date,
      rating: review.rating,
      reviewText: review.review_text,
      reviewUrl: review.review_url,
      featured: review.featured,
      sortOrder: review.sort_order,
      release: review.releases ? {
        id: review.releases.id,
        title: review.releases.title,
        imageUrl: review.releases.image_url,
        catalogNumber: review.releases.catalog_number
      } : null
    })) || []

    return NextResponse.json(transformedReviews)
  } catch (error) {
    console.error('Error in reviews API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}