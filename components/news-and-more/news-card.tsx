import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface NewsCardProps {
  news: {
    id: string
    date: string
    title: string
    description: string
  }
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news-and-more/${news.id}`} className="block group">
      <Card className="h-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50 dark:bg-gray-800 border-none">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground mb-2">{news.date}</p>
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-50 group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300 line-clamp-3">{news.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
