"use client"

import { Card, CardContent } from "@/components/ui/card"

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

function ReviewCard({ review }: { review: Review }) {
  const reviewDate = new Date(review.reviewDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Card className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">{review.publication}</h3>
          <p className="text-sm text-muted-foreground">{reviewDate}</p>
        </div>
        {review.reviewerName && <p className="text-sm text-muted-foreground mb-2">By {review.reviewerName}</p>}
        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{review.reviewText}</p>
        {review.rating && (
          <div className="flex items-center mt-3">
            <span className="text-yellow-500 mr-2">
              {"★".repeat(Math.floor(review.rating))}
              {review.rating % 1 !== 0 && "☆"}
            </span>
            <span className="text-sm text-muted-foreground">{review.rating}/5</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function ReviewsSection({ reviews, releaseTitle }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <section className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  )
}