import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

async function getVideo(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/videos/${encodeURIComponent(id)}`, {
      next: { revalidate: 3600 }
    })
    if (!response.ok) throw new Error('Video not found')
    return await response.json()
  } catch (error) {
    console.error('Error fetching video:', error)
    return null
  }
}

async function getRelatedVideos(currentId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/videos?limit=4`, {
      next: { revalidate: 3600 }
    })
    if (!response.ok) throw new Error('Failed to fetch related videos')
    const videos = await response.json()
    return videos.filter((video: any) => video.id !== currentId)
  } catch (error) {
    console.error('Error fetching related videos:', error)
    return []
  }
}

export default async function VideoDetailPage({ params }: { params: { id: string } }) {
  const video = await getVideo(params.id)
  
  if (!video) {
    notFound()
  }

  const relatedVideos = await getRelatedVideos(params.id)

  const getYouTubeEmbedUrl = (youtubeId: string) => {
    return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`
  }

  const getThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700">
        <div className="container px-4 md:px-6 py-6">
          <Link href="/news-and-more" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Videos & More
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50">
            {video.title}
          </h1>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(video.youtubeId)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {video.artistName && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{video.artistName}</span>
                    </div>
                  )}
                  {video.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {video.description && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {relatedVideos.length > 0 && (
              <div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-6">
                  Related Videos
                </h3>
                <div className="space-y-4">
                  {relatedVideos.slice(0, 3).map((relatedVideo: any) => (
                    <Link
                      key={relatedVideo.id}
                      href={`/videos/${relatedVideo.id}`}
                      className="group block"
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={getThumbnail(relatedVideo.youtubeId)}
                            alt={relatedVideo.title}
                            className="w-24 h-16 object-cover rounded group-hover:opacity-80 transition-opacity"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedVideo.title}
                          </h4>
                          {relatedVideo.artistName && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {relatedVideo.artistName}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button asChild className="w-full">
                    <Link href="/videos">
                      View All Videos
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}