'use client'

import { useSession } from '@/lib/use-session'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { supabase, type Video } from '@/lib/supabase'
import Link from 'next/link'
import { ResponsiveTable } from '@/components/responsive-table'

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

  const loadVideos = useCallback(async () => {
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
  }, [releaseFilter])

  useEffect(() => {
    loadVideos()
  }, [loadVideos])

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

      {/* Responsive Table */}
      <div className="mt-8">
        <ResponsiveTable
          columns={[
            {
              key: 'video',
              title: 'Video',
              width: 300,
              minWidth: 250,
              render: (_, video) => (
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
              )
            },
            {
              key: 'artist_name',
              title: 'Artist',
              width: 150,
              minWidth: 120
            },
            {
              key: 'url',
              title: 'URL Slug',
              width: 120,
              minWidth: 100
            },
            {
              key: 'youtube_id',
              title: 'YouTube ID',
              width: 120,
              minWidth: 100,
              render: (value) => (
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  {String(value)}
                </code>
              )
            },
            {
              key: 'actions',
              title: 'Actions',
              width: 120,
              minWidth: 100,
              render: (_, video) => (
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/videos/${video.id}/edit`}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              )
            }
          ]}
          data={videos}
          loading={loading}
        />
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