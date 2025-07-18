"use client"

import { Star, ExternalLink, Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  publication: string
  reviewerName?: string
  reviewDate: string
  rating?: number
  reviewText: string
  reviewUrl?: string
  featured: boolean
  sortOrder: number
}

interface ReviewsSectionProps {
  reviews: Review[]
  releaseTitle: string
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null
  
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - Math.ceil(rating)

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="h-4 w-4 text-gray-300" />
      ))}
      
      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const reviewDate = new Date(review.reviewDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Card className={`${review.featured ? 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-50">
                {review.publication}
              </CardTitle>
              {review.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {review.reviewerName && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{review.reviewerName}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{reviewDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <StarRating rating={review.rating} />
            {review.reviewUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <a 
                  href={review.reviewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Read Full Review
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {review.reviewText}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReviewsSection({ reviews, releaseTitle }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  // Calculate average rating
  const ratingsWithValues = reviews.filter(r => r.rating && r.rating > 0)
  const averageRating = ratingsWithValues.length > 0 
    ? ratingsWithValues.reduce((sum, r) => sum + (r.rating || 0), 0) / ratingsWithValues.length 
    : null

  return (
    <section className="mt-12 border-t pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Reviews
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            What critics are saying about "{releaseTitle}"
          </p>
        </div>
        
        {averageRating && (
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} />
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Based on {ratingsWithValues.length} review{ratingsWithValues.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}