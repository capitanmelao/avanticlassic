'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Review, type Release } from '@/lib/supabase'
import Link from 'next/link'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface ReviewWithRelease extends Review {
  releases?: Release
}

export default function ReviewsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<ReviewWithRelease[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPublication, setSelectedPublication] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          releases(*)
        `)
        .order('review_date', { ascending: false })

      if (error) {
        throw error
      }

      setReviews(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setReviews(reviews.filter(r => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review')
    }
  }

  const toggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ featured: !currentFeatured })
        .eq('id', id)

      if (error) {
        throw error
      }

      setReviews(reviews.map(r => 
        r.id === id ? { ...r, featured: !currentFeatured } : r
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review')
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.releases?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.publication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPublication = selectedPublication === 'all' || review.publication === selectedPublication
    
    return matchesSearch && matchesPublication
  })

  const publications = Array.from(new Set(reviews.map(r => r.publication))).sort()

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400">No rating</span>
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    )
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600">Manage press reviews and critiques</p>
        </div>
        <Link
          href="/dashboard/reviews/new"
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Review
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Publication Filter */}
        <select
          value={selectedPublication}
          onChange={(e) => setSelectedPublication(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="all">All Publications</option>
          {publications.map((pub) => (
            <option key={pub} value={pub}>{pub}</option>
          ))}
        </select>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <StarIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedPublication !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first review.'
            }
          </p>
          {(!searchTerm && selectedPublication === 'all') && (
            <div className="mt-6">
              <Link
                href="/dashboard/reviews/new"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Review
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <li key={review.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {review.releases?.title || 'Unknown Release'}
                        </h3>
                        {review.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{review.publication}</span>
                        {review.reviewer_name && (
                          <span>by {review.reviewer_name}</span>
                        )}
                        <span>{new Date(review.review_date).toLocaleDateString()}</span>
                      </div>

                      <div className="mt-2">
                        {renderStars(review.rating || 0)}
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {review.review_text}
                        </p>
                      </div>

                      {review.review_url && (
                        <div className="mt-2">
                          <a
                            href={review.review_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Read full review →
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleFeatured(review.id, review.featured)}
                        className={`p-2 rounded-full transition-colors ${
                          review.featured 
                            ? 'text-yellow-500 hover:text-yellow-600' 
                            : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        title={review.featured ? 'Remove from featured' : 'Add to featured'}
                      >
                        <StarIcon className={`h-5 w-5 ${review.featured ? 'fill-current' : ''}`} />
                      </button>

                      <Link
                        href={`/dashboard/reviews/${review.id}/edit`}
                        className="inline-flex items-center p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit review"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>

                      <button
                        onClick={() => deleteReview(review.id)}
                        className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete review"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">{reviews.length}</span> total reviews
          </div>
          <div>
            <span className="font-medium text-gray-900">{reviews.filter(r => r.featured).length}</span> featured
          </div>
          <div>
            <span className="font-medium text-gray-900">{publications.length}</span> publications
          </div>
          <div>
            <span className="font-medium text-gray-900">
              {reviews.filter(r => r.rating).length > 0 
                ? (reviews.filter(r => r.rating).reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.filter(r => r.rating).length).toFixed(1)
                : 'N/A'
              }
            </span> avg rating
          </div>
        </div>
      </div>
    </div>
  )
}