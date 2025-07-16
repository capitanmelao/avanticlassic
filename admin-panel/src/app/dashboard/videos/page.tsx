'use client'

import { useSession } from '@/lib/use-session'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Video } from '@/lib/supabase'
import Link from 'next/link'

export default function VideosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [releaseFilter, setReleaseFilter] = useState<string | null>(null)
  const [releaseTitle, setReleaseTitle] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    const release = searchParams.get('release')
    setReleaseFilter(release)
  }, [searchParams])

  useEffect(() => {
    loadVideos()
  }, [releaseFilter])

  const loadVideos = async () => {
    try {
      setLoading(true)
      
      // Build query with optional release filter
      let query = supabase
        .from('videos')
        .select('*, releases(title)')
        .order('created_at', { ascending: false })

      if (releaseFilter) {
        query = query.eq('release_id', releaseFilter)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setVideos(data || [])

      // Get release title if filtering
      if (releaseFilter && data && data.length > 0) {
        const releaseTitle = data[0]?.releases?.title
        setReleaseTitle(releaseTitle || null)
      } else if (releaseFilter) {
        // If filtering but no videos found, get release title directly
        const { data: releaseData } = await supabase
          .from('releases')
          .select('title')
          .eq('id', releaseFilter)
          .single()
        
        setReleaseTitle(releaseData?.title || null)
      } else {
        setReleaseTitle(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const deleteVideo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setVideos(videos.filter(video => video.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete video')
    }
  }

  const getYouTubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
  }

  const getYouTubeUrl = (youtubeId: string) => {
    return `https://www.youtube.com/watch?v=${youtubeId}`
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage YouTube videos and video gallery content.
          </p>
          {releaseFilter && releaseTitle && (
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <span className="mr-2">Filtered by release:</span>
              <span className="font-semibold">{releaseTitle}</span>
              <Link
                href="/dashboard/videos"
                className="ml-2 text-blue-600 hover:text-blue-800"
                title="Clear filter"
              >
                ×
              </Link>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/videos/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Video
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="mt-8 hidden lg:block">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Artist
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL Slug
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  YouTube ID
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videos.map((video) => (
                <tr key={video.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-28">
                        <img
                          className="h-16 w-28 rounded-md object-cover border border-gray-200"
                          src={getYouTubeThumbnail(video.youtube_id)}
                          alt={video.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {video.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          <a
                            href={getYouTubeUrl(video.youtube_id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {video.artist_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {video.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {video.youtube_id}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/dashboard/videos/${video.id}/edit`}
                      className="text-purple-600 hover:text-purple-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteVideo(video.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="mt-8 lg:hidden">
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-white shadow rounded-lg border border-gray-200">
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-20 w-32 rounded-lg object-cover border border-gray-200"
                      src={getYouTubeThumbnail(video.youtube_id)}
                      alt={video.title}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {video.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Artist: {video.artist_name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          URL: {video.url}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <code className="bg-gray-100 px-2 py-1 rounded">
                            {video.youtube_id}
                          </code>
                          <a
                            href={getYouTubeUrl(video.youtube_id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200"
                          >
                            Watch on YouTube
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Link
                        href={`/dashboard/videos/${video.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteVideo(video.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {videos.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No videos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first video.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/videos/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Add Video
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}