import Image from "next/image"
import Link from "next/link"

interface ReviewItemProps {
  review: {
    id: string
    date: string
    publication: string
    albumImage: string
    reviewText: string
  }
}

export function ReviewItem({ review }: ReviewItemProps) {
  return (
    <Link
      href={`/news-and-more/reviews/${review.id}`}
      className="flex items-start gap-4 p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      <div className="flex-shrink-0">
        <Image
          src={review.albumImage || "/placeholder.svg"}
          width={80}
          height={80}
          alt="Album cover"
          className="rounded-sm object-cover aspect-square"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground mb-1">{review.date}</p>
        <p className="font-semibold text-base text-gray-900 dark:text-gray-50 mb-1">{review.publication}</p>
        <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-3 group-hover:text-primary transition-colors">
          {review.reviewText}
        </p>
      </div>
    </Link>
  )
}
