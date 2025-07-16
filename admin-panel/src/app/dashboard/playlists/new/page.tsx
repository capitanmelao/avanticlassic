'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Release } from '@/lib/supabase'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import ImageUpload from '@/components/ImageUpload'

interface FormData {
  slug: string
  title: string
  description: string
  category: 'by_artist' | 'by_composer' | ''
  image_url: string
  spotify_url: string
  apple_music_url: string
  youtube_url: string
  featured: boolean
  sort_order: number
  // Translations
  translations: {
    en: { title: string; description: string }
    fr: { title: string; description: string }
    de: { title: string; description: string }
  }
  // Selected releases for tracks
  selectedReleases: number[]
}

export default function NewPlaylistPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    slug: '',
    title: '',
    description: '',
    category: '',
    image_url: '',
    spotify_url: '',
    apple_music_url: '',
    youtube_url: '',
    featured: false,
    sort_order: 0,
    translations: {
      en: { title: '', description: '' },
      fr: { title: '', description: '' },
      de: { title: '', description: '' }
    },
    selectedReleases: []
  })

  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'tracks'>('basic')
  const [, setImagePath] = useState<string | null>(null)

  useEffect(() => {
    loadReleases()
  }, [])

  const loadReleases = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('title')

      if (error) throw error
      setReleases(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load releases')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlaylistMetadata = async (url: string) => {
    try {
      if (url.includes('spotify.com')) {
        // For Spotify playlists, we would need Spotify Web API
        // For now, we'll just extract the playlist ID and create a basic image URL
        const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1]
        if (playlistId) {
          // This is a placeholder - in production you'd use Spotify Web API
          setFormData(prev => ({
            ...prev,
            image_url: `https://mosaic.scdn.co/640/ab67616d0000b273${playlistId.slice(0, 32)}`
          }))
        }
      } else if (url.includes('music.apple.com')) {
        // For Apple Music playlists, we would need Apple Music API
        // This is a placeholder implementation
        const playlistId = url.match(/playlist\/[^\/]+\/pl\.([a-zA-Z0-9]+)/)?.[1]
        if (playlistId) {
          // Placeholder image URL
          setFormData(prev => ({
            ...prev,
            image_url: `https://is1-ssl.mzstatic.com/image/thumb/Music${playlistId.slice(0, 8)}/600x600.jpg`
          }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch playlist metadata:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      // Create playlist
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .insert({
          slug: formData.slug,
          title: formData.title,
          description: formData.description || null,
          category: formData.category || null,
          image_url: formData.image_url || null,
          spotify_url: formData.spotify_url || null,
          apple_music_url: formData.apple_music_url || null,
          youtube_url: formData.youtube_url || null,
          featured: formData.featured,
          sort_order: formData.sort_order,
        })
        .select()
        .single()

      if (playlistError) throw playlistError

      // Add translations
      const translations = []
      for (const [lang, content] of Object.entries(formData.translations)) {
        if (content.title || content.description) {
          translations.push({
            playlist_id: playlist.id,
            language: lang,
            title: content.title || formData.title,
            description: content.description || formData.description
          })
        }
      }

      if (translations.length > 0) {
        await supabase
          .from('playlist_translations')
          .insert(translations)
      }

      // Add tracks
      if (formData.selectedReleases.length > 0) {
        const tracks = formData.selectedReleases.map((releaseId, index) => ({
          playlist_id: playlist.id,
          release_id: releaseId,
          sort_order: index
        }))

        await supabase
          .from('playlist_tracks')
          .insert(tracks)
      }

      router.push('/dashboard/playlists')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof FormData, value: string | number | boolean | number[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (url: string, path: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
    setImagePath(path)
  }

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image_url: '' }))
    setImagePath(null)
  }

  const updateTranslation = (lang: 'en' | 'fr' | 'de', field: 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value
        }
      }
    }))
  }

  const toggleRelease = (releaseId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedReleases: prev.selectedReleases.includes(releaseId)
        ? prev.selectedReleases.filter(id => id !== releaseId)
        : [...prev.selectedReleases, releaseId]
    }))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !formData.slug) {
      updateField('slug', generateSlug(formData.title))
    }
  }, [formData.title, formData.slug])

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/playlists"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Playlists
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Playlist</h1>
            <p className="text-gray-600">Create a curated playlist by artist or composer</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'basic', name: 'Basic Info' },
              { id: 'content', name: 'Content & Links' },
              { id: 'tracks', name: 'Track Selection' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'basic' | 'content' | 'tracks')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select category...</option>
                  <option value="by_artist">By Artist</option>
                  <option value="by_composer">By Composer</option>
                </select>
              </div>

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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Playlist</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Content & Links Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* External Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">External Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spotify URL
                  </label>
                  <input
                    type="text"
                    value={formData.spotify_url}
                    onChange={(e) => {
                      updateField('spotify_url', e.target.value)
                      if (e.target.value) fetchPlaylistMetadata(e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://open.spotify.com/playlist/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apple Music URL
                  </label>
                  <input
                    type="text"
                    value={formData.apple_music_url}
                    onChange={(e) => {
                      updateField('apple_music_url', e.target.value)
                      if (e.target.value) fetchPlaylistMetadata(e.target.value)
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://music.apple.com/playlist/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={formData.youtube_url}
                    onChange={(e) => updateField('youtube_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://youtube.com/playlist?list=..."
                  />
                </div>

                <div>
                  <ImageUpload
                    bucket="playlists"
                    folder="playlist-covers"
                    currentImageUrl={formData.image_url}
                    onUploadSuccess={handleImageUpload}
                    onUploadError={(error) => setError(error)}
                    onRemove={handleImageRemove}
                    label="Cover Image"
                  />
                </div>
              </div>
            </div>

            {/* Multilingual Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Translations (Optional)</h3>
              
              <div className="space-y-6">
                {(['en', 'fr', 'de'] as const).map((lang) => (
                  <div key={lang} className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'German'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.translations[lang].title}
                          onChange={(e) => updateTranslation(lang, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={`Title in ${lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'German'}`}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={formData.translations[lang].description}
                          onChange={(e) => updateTranslation(lang, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder={`Description in ${lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'German'}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Track Selection Tab */}
        {activeTab === 'tracks' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Releases</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose releases to include in this playlist. You can reorder them later.
            </p>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {releases.map((release) => (
                  <label
                    key={release.id}
                    className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedReleases.includes(release.id)}
                      onChange={() => toggleRelease(release.id)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{release.title}</p>
                      <p className="text-xs text-gray-500">{release.catalog_number}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {formData.selectedReleases.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  Selected {formData.selectedReleases.length} release{formData.selectedReleases.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/playlists"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </form>
    </div>
  )
}