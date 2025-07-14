'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Video } from '@/lib/supabase'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

interface FormData {
  url: string
  title: string
  artist_name: string
  youtube_id: string
  youtube_url: string
  thumbnail_url: string
  duration: number
  view_count: number
  published_date: string
  featured: boolean
  sort_order: number
}

export default function EditVideoPage() {
  const router = useRouter()
  const params = useParams()
  const videoId = params.id as string

  const [formData, setFormData] = useState<FormData>({
    url: '',
    title: '',
    artist_name: '',
    youtube_id: '',
    youtube_url: '',
    thumbnail_url: '',
    duration: 0,
    view_count: 0,
    published_date: '',
    featured: false,
    sort_order: 0
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper functions for YouTube data
  const getYouTubeThumbnail = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }

  const getYouTubeUrl = (youtubeId: string) => {
    return `https://www.youtube.com/watch?v=${youtubeId}`
  }

  const extractYouTubeId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  const fetchYouTubeMetadata = async (youtubeId: string) => {
    try {
      // Use YouTube oEmbed API to get video metadata
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`)
      if (response.ok) {
        const data = await response.json()
        return {
          title: data.title,
          author_name: data.author_name,
          thumbnail_url: data.thumbnail_url
        }
      }
    } catch (error) {
      console.error('Failed to fetch YouTube metadata:', error)
    }
    return null
  }

  useEffect(() => {
    loadVideo()
  }, [videoId])

  const loadVideo = async () => {
    try {
      setLoading(true)
      
      const { data: video, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()

      if (videoError) throw videoError

      if (video) {
        setFormData({
          url: video.url || '',
          title: video.title || '',
          artist_name: video.artist_name || '',
          youtube_id: video.youtube_id || '',
          youtube_url: video.youtube_url || '',
          thumbnail_url: video.thumbnail_url || '',
          duration: video.duration || 0,
          view_count: video.view_count || 0,
          published_date: video.published_date || '',
          featured: video.featured || false,
          sort_order: video.sort_order || 0
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load video')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      // Update video
      const { error: videoError } = await supabase
        .from('videos')
        .update({
          url: formData.url,
          title: formData.title,
          artist_name: formData.artist_name,
          youtube_id: formData.youtube_id,
          youtube_url: formData.youtube_url || getYouTubeUrl(formData.youtube_id),
          thumbnail_url: formData.thumbnail_url || getYouTubeThumbnail(formData.youtube_id),
          duration: formData.duration || null,
          view_count: formData.view_count || null,
          published_date: formData.published_date || null,
          featured: formData.featured,
          sort_order: formData.sort_order,
        })
        .eq('id', videoId)

      if (videoError) throw videoError

      router.push('/dashboard/videos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save video')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleYouTubeUrlChange = async (url: string) => {
    updateField('youtube_url', url)
    
    const youtubeId = extractYouTubeId(url)
    if (youtubeId) {
      updateField('youtube_id', youtubeId)
      updateField('thumbnail_url', getYouTubeThumbnail(youtubeId))
      
      // Try to fetch metadata
      const metadata = await fetchYouTubeMetadata(youtubeId)
      if (metadata) {
        if (!formData.title) {
          updateField('title', metadata.title)
        }
        if (!formData.artist_name) {
          updateField('artist_name', metadata.author_name)
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/videos"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Videos
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Video</h1>
            <p className="text-gray-600">Update video information and metadata</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* YouTube URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL *
              </label>
              <input
                type="url"
                required
                value={formData.youtube_url}
                onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {/* Video Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Artist Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name *
              </label>
              <input
                type="text"
                required
                value={formData.artist_name}
                onChange={(e) => updateField('artist_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* URL Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => updateField('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* YouTube ID (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube ID
              </label>
              <input
                type="text"
                value={formData.youtube_id}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => updateField('duration', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* View Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Count
              </label>
              <input
                type="number"
                value={formData.view_count}
                onChange={(e) => updateField('view_count', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Published Date
              </label>
              <input
                type="date"
                value={formData.published_date}
                onChange={(e) => updateField('published_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => updateField('sort_order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Featured Video */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Video</span>
              </label>
            </div>

            {/* Video Preview */}
            {formData.youtube_id && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <img
                      src={getYouTubeThumbnail(formData.youtube_id)}
                      alt="YouTube thumbnail"
                      className="h-24 w-40 object-cover rounded-md border border-gray-200"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{formData.title}</h3>
                      <p className="text-sm text-gray-600">{formData.artist_name}</p>
                      <a
                        href={getYouTubeUrl(formData.youtube_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 hover:text-purple-800"
                      >
                        View on YouTube →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/videos"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Video'}
          </button>
        </div>
      </form>
    </div>
  )
}