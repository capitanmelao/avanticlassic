import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { ReviewItem } from "@/components/news-and-more/review-item"

// Fetch videos from API
async function getVideos() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/videos?limit=6`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (!response.ok) throw new Error('Failed to fetch videos')
    return await response.json()
  } catch (error) {
    console.error('Error fetching videos:', error)
    return []
  }
}

// Video card component
function VideoCard({ video }: { video: any }) {
  const getThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
  }

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={getThumbnail(video.youtubeId)}
          alt={video.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 mb-2 line-clamp-2">
          {video.title}
        </h3>
        {video.artistName && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {video.artistName}
          </p>
        )}
      </div>
    </div>
  )
}

// Dummy data for reviews
const dummyReviews = [
  {
    id: "r1",
    date: "25.06.2026",
    publication: "LA LIBRE BELGIQUE",
    albumImage: "/placeholder.svg?height=80&width=80&text=Album+1",
    reviewText:
      "[...] la voix chaleureuse, le naturel et la maîtrise de Appl transforment le concept en une véritable réussite artistique.",
  },
  {
    id: "r2",
    date: "11.11.2025",
    publication: "BBC RADIO 3",
    albumImage: "/placeholder.svg?height=80&width=80&text=Album+2",
    reviewText:
      "There's an excellent mike balance here which means that the clarity is superb, and it really captures that youthful fresh vigour in his performance. He's known for flair and risk-taking and I think he was an excellent choice for the concert.",
  },
  {
    id: "r3",
    date: "11.11.2025",
    publication: "BBC RADIO 3",
    albumImage: "/placeholder.svg?height=80&width=80&text=Album+3",
    reviewText:
      "What they do bring instead is a freshness and they're very good at sustaining the pace, so it's a lovely recording. Like I said it's got a freshness to it, and it does seem very well historically informed. Quite exciting.",
  },
]

export default async function VideosAndMorePage() {
  const videos = await getVideos()

  return (
    <div className="flex flex-col">
      {/* Featured Videos Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">FEATURED VIDEOS</h1>
            <Button asChild variant="link" className="text-primary hover:underline">
              <Link href="/videos">
                ALL VIDEOS <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.length > 0 ? (
              videos.map((video: any) => (
                <Link key={video.id} href={`/videos/${video.id}`}>
                  <VideoCard video={video} />
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No videos available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Videos Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-8">
            DISCOVER OUR PERFORMANCES
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-8">
            Immerse yourself in the world of classical music through our carefully curated collection of performances. 
            From intimate chamber music to grand orchestral works, experience the artistry and passion of our talented artists.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-50">Live Performances</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Experience the energy and emotion of live classical music performances
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-50">Artist Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get to know our artists through interviews and behind-the-scenes content
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" fill="currentColor" />
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900 dark:text-gray-50">High Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All videos are recorded and produced with the highest quality standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50">REVIEWS</h2>
            <Button asChild variant="link" className="text-primary hover:underline">
              <Link href="#">
                ALL REVIEWS <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dummyReviews.map((reviewItem) => (
              <ReviewItem key={reviewItem.id} review={reviewItem} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
