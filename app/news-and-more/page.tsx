import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { ReviewItem } from "@/components/news-and-more/review-item"

// Legacy videos from old SSG site with real titles from YouTube
const legacyVideos = [
  { id: "legacy-1", youtubeId: "aHsF6g6iHy4", title: "Roby Lakatos Biréli Lagrène - Tribute to Stéphane & Django", artistName: "Avanticlassic" },
  { id: "legacy-2", youtubeId: "iYSvHYKX4Ms", title: "HOMILIA - New Album! Manu Comté & B'Strings Quintet feat. Tomás Gubitsch", artistName: "Manu Comté" },
  { id: "legacy-3", youtubeId: "tjGkbx1JA6Q", title: "ROBY LAKATOS plays « Du Schwarzer Zigeuner » from the new album 'LA PASSION'", artistName: "Avanticlassic" },
  { id: "legacy-4", youtubeId: "RsJY-BIcLhg", title: "Trailer to the upcoming album of Duo Lechner Tiempo \"Tango Rhapsody\"", artistName: "Avanticlassic" },
  { id: "legacy-5", youtubeId: "rWXaVSD9mwE", title: "Alexander Gurning on Bach's Goldberg Variations", artistName: "Avanticlassic" },
  { id: "legacy-6", youtubeId: "u_A7Tgg8zD4", title: "Duo Lechner Tiempo: La Muerte del Ángel by Ástor Piazzolla", artistName: "Avanticlassic" },
  { id: "legacy-7", youtubeId: "pTBbGE5iBEE", title: "Philippe Quint plays Bruch, Mendelssohn and Beethoven", artistName: "Avanticlassic" },
  { id: "legacy-8", youtubeId: "M7D6tCB9AqA", title: "Roby Lakatos - Romania from the album Klezmer Karma", artistName: "Avanticlassic" },
  { id: "legacy-9", youtubeId: "omuZF6oaCnw", title: "Duo Lechner Tiempo: Variations on a Theme by Paganini", artistName: "Avanticlassic" },
  { id: "legacy-10", youtubeId: "wc7Lksz1aBM", title: "Duo Lechner Tiempo: \"Slavonic Dance, Op. 72, No. 2 in E minor\" by Antonin Dvořák", artistName: "Avanticlassic" },
  { id: "legacy-11", youtubeId: "9U3F7yP6Mxk", title: "Roby Lakatos - Hejre Kati from the album Fire Dance", artistName: "Avanticlassic" },
  { id: "legacy-12", youtubeId: "8_oIqWuSu5o", title: "WUNDERHORN", artistName: "Avanticlassic" },
  { id: "legacy-13", youtubeId: "-rV5CcK1hd4", title: "RENDEZ-VOUS WITH MARTHA ARGERICH volume 3", artistName: "Avanticlassic" }
]

// Fetch videos from API
async function getVideos() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/videos?limit=12`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (!response.ok) throw new Error('Failed to fetch videos')
    const apiVideos = await response.json()
    
    // Combine API videos with legacy videos, limit total to 15 for display
    const allVideos = [...apiVideos, ...legacyVideos].slice(0, 15)
    return allVideos
  } catch (error) {
    console.error('Error fetching videos:', error)
    // Return just legacy videos if API fails
    return legacyVideos.slice(0, 12)
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
        <Image
          src={getThumbnail(video.youtubeId)}
          alt={video.title}
          width={400}
          height={225}
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

// Fetch reviews from API
async function getReviews() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/reviews?featured=true&limit=3`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (!response.ok) throw new Error('Failed to fetch reviews')
    const reviews = await response.json()
    
    // Transform to match ReviewItem interface
    return reviews.map((review: any) => ({
      id: review.id,
      date: new Date(review.reviewDate).toLocaleDateString('en-GB'),
      publication: review.publication,
      albumImage: review.release?.imageUrl || "/placeholder.svg",
      reviewText: review.reviewText
    }))
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export default async function VideosAndMorePage() {
  const videos = await getVideos()
  const reviews = await getReviews()

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {videos.length > 0 ? (
              videos.map((video: any) => (
                <div key={video.id}>
                  {video.id.toString().startsWith('legacy-') ? (
                    // For legacy videos, use direct YouTube link
                    <a
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <VideoCard video={video} />
                    </a>
                  ) : (
                    // For API videos, use internal link
                    <Link href={`/videos/${video.id}`}>
                      <VideoCard video={video} />
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No videos available at the moment.</p>
              </div>
            )}
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
            {reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <ReviewItem key={reviewItem.id} review={reviewItem} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No reviews available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
