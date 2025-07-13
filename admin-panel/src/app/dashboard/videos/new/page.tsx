'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NewVideoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlCheckLoading, setUrlCheckLoading] = useState(false)
  const [urlExists, setUrlExists] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    artist_name: '',
    youtube_id: ''
  })

  const [translations, setTranslations] = useState({
    en: '',
    fr: '',
    de: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const generateUrlSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : url
  }

  const checkUrlAvailability = async (url: string) => {
    if (!url.trim()) {
      setUrlExists(false)
      return
    }

    setUrlCheckLoading(true)
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('url')
        .eq('url', url)
        .maybeSingle()

      if (error) {
        console.warn('URL check error:', error)
        setUrlExists(false)
        return
      }

      setUrlExists(!!data)
    } catch (err) {
      console.warn('URL availability check failed:', err)
      setUrlExists(false)
    } finally {
      setUrlCheckLoading(false)
    }
  }

  const handleTitleChange = (title: string) => {
    const newUrl = generateUrlSlug(title)
    setFormData(prev => ({
      ...prev,
      title,
      url: newUrl
    }))
    checkUrlAvailability(newUrl)
  }

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }))
    checkUrlAvailability(url)
  }

  const handleYouTubeUrlChange = (url: string) => {
    const youtubeId = extractYouTubeId(url)
    setFormData(prev => ({ ...prev, youtube_id: youtubeId }))
  }

  const getYouTubeThumbnail = (youtubeId: string) => {
    if (!youtubeId || youtubeId.length !== 11) return null
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (urlExists) {
      setError('Cannot create video: URL slug already exists. Please choose a different URL slug.')
      return
    }
    
    if (!formData.title.trim() || !formData.url.trim() || !formData.artist_name.trim() || !formData.youtube_id.trim()) {
      setError('Video title, URL slug, artist name, and YouTube ID are required.')
      return
    }

    if (formData.youtube_id.length !== 11) {
      setError('Invalid YouTube ID. Please provide a valid YouTube video URL or ID.')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const videoPayload = {
        title: formData.title,
        url: formData.url,
        artist_name: formData.artist_name,
        youtube_id: formData.youtube_id
      }
      
      console.log('Creating video with payload:', videoPayload)
      
      // Create video
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert([videoPayload])
        .select()
        .single()

      if (videoError) throw videoError

      // Create descriptions if provided
      const languages = ['en', 'fr', 'de'] as const
      const descriptionsToInsert = []

      for (const lang of languages) {
        const description = translations[lang].trim()
        if (description) {
          descriptionsToInsert.push({
            video_id: videoData.id,
            language: lang,
            description: description
          })
        }
      }

      if (descriptionsToInsert.length > 0) {
        const { error: descriptionsError } = await supabase
          .from('video_descriptions')
          .insert(descriptionsToInsert)

        if (descriptionsError) {
          console.warn('Failed to create some descriptions:', descriptionsError)
          // Don't fail the whole operation for description errors
        }
      }

      router.push('/dashboard/videos')
    } catch (err) {
      console.error('Create video error:', err)
      if (err instanceof Error) {
        if (err.message.includes('videos_pkey')) {
          setError('Database ID conflict. Please try again.')
        } else if (err.message.includes('videos_url_key') || err.message.includes('duplicate key')) {
          setError(`A video with URL slug "${formData.url}" already exists. Please choose a different URL slug.`)
        } else if (err.message.includes('23505')) {
          if (err.message.includes('videos_url_key')) {
            setError(`URL slug "${formData.url}" is already taken. Please choose a different one.`)
          } else {
            setError('A duplicate entry was detected. Please check your input and try again.')
          }
        } else {
          setError(`Failed to create video: ${err.message}`)
        }
      } else {
        setError('Failed to create video: Unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Add New Video
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/dashboard/videos"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Videos
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Basic Information
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Video title, artist, and URL slug for the website.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="e.g., Bach: Goldberg Variations - Aria"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="artist_name" className="block text-sm font-medium text-gray-700">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    id="artist_name"
                    required
                    value={formData.artist_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, artist_name: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="e.g., Glenn Gould"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    URL Slug *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="url"
                      required
                      value={formData.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${
                        urlExists ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="e.g., bach-goldberg-variations-aria"
                    />
                    {urlCheckLoading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                  {urlExists && (
                    <p className="mt-2 text-sm text-red-600">
                      ⚠️ This URL slug is already taken. Please choose a different one.
                    </p>
                  )}
                  {!urlExists && formData.url && !urlCheckLoading && (
                    <p className="mt-2 text-sm text-green-600">
                      ✅ This URL slug is available.
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    This will be used in the URL: /videos/{formData.url}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">YouTube Video</h3>
              <p className="mt-1 text-sm text-gray-500">
                YouTube video URL or ID for embedding.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700">
                    YouTube URL or Video ID *
                  </label>
                  <input
                    type="text"
                    id="youtube_url"
                    value={formData.youtube_id}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    💡 Paste a full YouTube URL or just the video ID (11 characters)
                  </p>
                  {formData.youtube_id && formData.youtube_id.length === 11 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <img
                        src={getYouTubeThumbnail(formData.youtube_id)}
                        alt="YouTube thumbnail"
                        className="h-32 w-56 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Video Descriptions (Multilingual)
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Video descriptions in English, French, and German.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-6">
                <div>
                  <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">
                    English Description
                  </label>
                  <textarea
                    id="description_en"
                    rows={4}
                    value={translations.en}
                    onChange={(e) => setTranslations(prev => ({ ...prev, en: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Enter a detailed description of the video content..."
                  />
                </div>

                <div>
                  <label htmlFor="description_fr" className="block text-sm font-medium text-gray-700">
                    French Description (Description française)
                  </label>
                  <textarea
                    id="description_fr"
                    rows={4}
                    value={translations.fr}
                    onChange={(e) => setTranslations(prev => ({ ...prev, fr: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Entrez une description détaillée du contenu vidéo..."
                  />
                </div>

                <div>
                  <label htmlFor="description_de" className="block text-sm font-medium text-gray-700">
                    German Description (Deutsche Beschreibung)
                  </label>
                  <textarea
                    id="description_de"
                    rows={4}
                    value={translations.de}
                    onChange={(e) => setTranslations(prev => ({ ...prev, de: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Geben Sie eine detaillierte Beschreibung des Videoinhalts ein..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/videos"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || urlExists || !formData.title || !formData.url || !formData.artist_name || !formData.youtube_id || formData.youtube_id.length !== 11}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Video'}
          </button>
        </div>
      </form>
    </div>
  )
}