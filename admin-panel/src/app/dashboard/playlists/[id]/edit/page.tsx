'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Release, type PlaylistTrack } from '@/lib/supabase'
import { ChevronLeftIcon, TrashIcon } from '@heroicons/react/24/outline'

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
  // Current tracks
  tracks: Array<PlaylistTrack & { release?: Release }>
}

export default function EditPlaylistPage() {
  const router = useRouter()
  const params = useParams()
  const playlistId = params.id as string

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
    tracks: []
  })

  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'tracks'>('basic')
  const [showAddTrack, setShowAddTrack] = useState(false)

  useEffect(() => {
    loadData()
  }, [playlistId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load playlist data
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_translations(*),
          playlist_tracks(*, release:releases(*))
        `)
        .eq('id', playlistId)
        .single()

      if (playlistError) throw playlistError

      // Load all releases for track selection
      const { data: allReleases, error: releasesError } = await supabase
        .from('releases')
        .select('*')
        .order('title')

      if (releasesError) throw releasesError

      if (playlist) {
        // Transform translations
        const translations = {
          en: { title: '', description: '' },
          fr: { title: '', description: '' },
          de: { title: '', description: '' }
        }

        playlist.playlist_translations?.forEach((trans: {language: string; title?: string; description?: string}) => {
          if (translations[trans.language as keyof typeof translations]) {
            translations[trans.language as keyof typeof translations] = {
              title: trans.title || '',
              description: trans.description || ''
            }
          }
        })

        setFormData({
          slug: playlist.slug || '',
          title: playlist.title || '',
          description: playlist.description || '',
          category: playlist.category || '',
          image_url: playlist.image_url || '',
          spotify_url: playlist.spotify_url || '',
          apple_music_url: playlist.apple_music_url || '',
          youtube_url: playlist.youtube_url || '',
          featured: playlist.featured || false,
          sort_order: playlist.sort_order || 0,
          translations,
          tracks: playlist.playlist_tracks?.sort((a: {sort_order: number}, b: {sort_order: number}) => a.sort_order - b.sort_order) || []
        })
      }

      setReleases(allReleases || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlaylistMetadata = async (url: string) => {
    try {
      if (url.includes('spotify.com')) {
        const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1]
        if (playlistId) {
          setFormData(prev => ({
            ...prev,
            image_url: `https://mosaic.scdn.co/640/ab67616d0000b273${playlistId.slice(0, 32)}`
          }))
        }
      } else if (url.includes('music.apple.com')) {
        const playlistId = url.match(/playlist\/[^\/]+\/pl\.([a-zA-Z0-9]+)/)?.[1]
        if (playlistId) {
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

      // Update playlist
      const { error: playlistError } = await supabase
        .from('playlists')
        .update({
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
        .eq('id', playlistId)

      if (playlistError) throw playlistError

      // Update translations
      for (const [lang, content] of Object.entries(formData.translations)) {
        if (content.title || content.description) {
          await supabase
            .from('playlist_translations')
            .upsert({
              playlist_id: parseInt(playlistId),
              language: lang,
              title: content.title || formData.title,
              description: content.description || formData.description
            })
        }
      }

      router.push('/dashboard/playlists')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update playlist')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof FormData, value: string | number | boolean | Array<PlaylistTrack & { release?: Release }>) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const addTrack = async (releaseId: number) => {
    try {
      const nextSortOrder = Math.max(...formData.tracks.map(t => t.sort_order), -1) + 1
      
      const { data: track, error } = await supabase
        .from('playlist_tracks')
        .insert({
          playlist_id: parseInt(playlistId),
          release_id: releaseId,
          sort_order: nextSortOrder
        })
        .select('*, release:releases(*)')
        .single()

      if (error) throw error

      setFormData(prev => ({
        ...prev,
        tracks: [...prev.tracks, track]
      }))
      
      setShowAddTrack(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add track')
    }
  }

  const removeTrack = async (trackId: number) => {
    if (!confirm('Are you sure you want to remove this track from the playlist?')) return

    try {
      const { error } = await supabase
        .from('playlist_tracks')
        .delete()
        .eq('id', trackId)

      if (error) throw error

      setFormData(prev => ({
        ...prev,
        tracks: prev.tracks.filter(t => t.id !== trackId)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove track')
    }
  }

  const moveTrack = async (trackId: number, direction: 'up' | 'down') => {
    const currentIndex = formData.tracks.findIndex(t => t.id === trackId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= formData.tracks.length) return

    const newTracks = [...formData.tracks]
    const [movedTrack] = newTracks.splice(currentIndex, 1)
    newTracks.splice(newIndex, 0, movedTrack)

    // Update sort orders
    const updates = newTracks.map((track, index) => ({
      id: track.id,
      sort_order: index
    }))

    try {
      for (const update of updates) {
        await supabase
          .from('playlist_tracks')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
      }

      setFormData(prev => ({
        ...prev,
        tracks: newTracks.map((track, index) => ({ ...track, sort_order: index }))
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder tracks')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  const availableReleases = releases.filter(release => 
    !formData.tracks.some(track => track.release_id === release.id)
  )

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
            <h1 className="text-2xl font-bold text-gray-900">Edit Playlist</h1>
            <p className="text-gray-600">Update playlist information and tracks</p>
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
              { id: 'tracks', name: `Tracks (${formData.tracks.length})` }
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
                    type="url"
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
                    type="url"
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
                    type="url"
                    value={formData.youtube_url}
                    onChange={(e) => updateField('youtube_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="https://youtube.com/playlist?list=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => updateField('image_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {formData.image_url && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview:</label>
                  <img
                    src={formData.image_url}
                    alt="Playlist cover"
                    className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Multilingual Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Translations</h3>
              
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

        {/* Tracks Tab */}
        {activeTab === 'tracks' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Playlist Tracks</h3>
              <button
                type="button"
                onClick={() => setShowAddTrack(!showAddTrack)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Add Track
              </button>
            </div>

            {/* Add Track Interface */}
            {showAddTrack && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-3">Add Release to Playlist</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {availableReleases.map((release) => (
                    <button
                      key={release.id}
                      type="button"
                      onClick={() => addTrack(release.id)}
                      className="p-3 text-left border border-gray-200 rounded-md hover:bg-white transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">{release.title}</p>
                      <p className="text-xs text-gray-500">{release.catalog_number}</p>
                    </button>
                  ))}
                </div>
                {availableReleases.length === 0 && (
                  <p className="text-sm text-gray-500">All releases have been added to the playlist.</p>
                )}
              </div>
            )}

            {/* Current Tracks */}
            {formData.tracks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tracks in this playlist yet.</p>
                <p className="text-sm">Click "Add Track" to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-md"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500 font-mono w-8">
                        {index + 1}.
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {track.release?.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {track.release?.catalog_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => moveTrack(track.id!, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTrack(track.id!, 'down')}
                        disabled={index === formData.tracks.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTrack(track.id!)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
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
            {saving ? 'Saving...' : 'Save Playlist'}
          </button>
        </div>
      </form>
    </div>
  )
}