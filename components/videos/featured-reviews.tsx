"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

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
  release?: {
    id: number
    title: string
    imageUrl?: string
    catalogNumber?: string
  }
}

interface FeaturedReviewsProps {
  reviews: Review[]
}

function ReviewCard({ review }: { review: Review }) {
  const [showFullText, setShowFullText] = useState(false)
  const maxCharacters = 250 // Shorter for featured reviews
  
  const reviewDate = new Date(review.reviewDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const isLongText = review.reviewText.length > maxCharacters
  const displayedText = showFullText ? review.reviewText : review.reviewText.length > maxCharacters 
    ? `${review.reviewText.substring(0, maxCharacters)}...` 
    : review.reviewText

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <Card className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        {/* Release info if available */}
        {review.release && (
          <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {review.release.imageUrl && (
              <Image
                src={review.release.imageUrl}
                alt={review.release.title}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
            )}
            <div>
              <Link 
                href={`/releases/${review.release.id}`}
                className="font-semibold text-gray-900 dark:text-gray-50 hover:text-primary transition-colors"
              >
                {review.release.title}
              </Link>
              {review.release.catalogNumber && (
                <p className="text-sm text-muted-foreground">{review.release.catalogNumber}</p>
              )}
            </div>
          </div>
        )}

        {/* Review header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50">{review.publication}</h3>
          <p className="text-sm text-muted-foreground">{reviewDate}</p>
        </div>

        {/* Reviewer and rating */}
        <div className="flex items-center justify-between mb-3">
          {review.reviewerName && (
            <p className="text-sm text-muted-foreground">By {review.reviewerName}</p>
          )}
          {review.rating && (
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
              <span className="text-sm text-muted-foreground ml-2">({review.rating}/5)</span>
            </div>
          )}
        </div>

        {/* Review text */}
        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{displayedText}</p>
        
        {/* Show more/less button */}
        {isLongText && (
          <Button
            variant="link"
            onClick={() => setShowFullText(!showFullText)}
            className="p-0 h-auto mb-3 text-primary hover:underline"
          >
            {showFullText ? "Show Less" : "Show More"}
          </Button>
        )}

        {/* Read full review link */}
        {review.reviewUrl && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <a
              href={review.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              Read full review →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function FeaturedReviews({ reviews }: FeaturedReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return null
  }

  return (
    <section className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50 text-center">
          Latest Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}