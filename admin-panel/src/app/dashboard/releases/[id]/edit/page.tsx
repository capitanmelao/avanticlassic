'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Artist } from '@/lib/supabase'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import ImageUpload from '@/components/ImageUpload'
import { extractStoragePath } from '@/lib/image-upload'

interface FormData {
  url: string
  title: string
  format: string
  shop_url: string
  release_date: string
  catalog_number: string
  image_url: string
  featured: boolean
  sort_order: number
  // Streaming links
  spotify_url: string
  apple_music_url: string
  youtube_music_url: string
  amazon_music_url: string
  bandcamp_url: string
  soundcloud_url: string
  // SEO
  meta_title: string
  meta_description: string
  // Translations
  translations: {
    en: { tracklist: string; description: string }
    fr: { tracklist: string; description: string }
    de: { tracklist: string; description: string }
  }
  // Artists
  artistIds: number[]
}

export default function EditReleasePage() {
  const router = useRouter()
  const params = useParams()
  const releaseId = params.id as string

  const [formData, setFormData] = useState<FormData>({
    url: '',
    title: '',
    format: 'CD',
    shop_url: '',
    release_date: '',
    catalog_number: '',
    image_url: '',
    featured: false,
    sort_order: 0,
    spotify_url: '',
    apple_music_url: '',
    youtube_music_url: '',
    amazon_music_url: '',
    bandcamp_url: '',
    soundcloud_url: '',
    meta_title: '',
    meta_description: '',
    translations: {
      en: { tracklist: '', description: '' },
      fr: { tracklist: '', description: '' },
      de: { tracklist: '', description: '' }
    },
    artistIds: []
  })

  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'streaming' | 'seo'>('basic')
  const [, setImagePath] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [releaseId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load artists for selection
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .order('name')

      if (artistsError) throw artistsError
      setArtists(artistsData || [])

      // Load release data
      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .select(`
          *,
          release_translations(*),
          release_artists(artist_id)
        `)
        .eq('id', releaseId)
        .single()

      if (releaseError) throw releaseError

      if (release) {
        // Transform translations into our format
        const translations = {
          en: { tracklist: '', description: '' },
          fr: { tracklist: '', description: '' },
          de: { tracklist: '', description: '' }
        }

        release.release_translations?.forEach((trans: {language: string; tracklist?: string; description?: string}) => {
          if (translations[trans.language as keyof typeof translations]) {
            translations[trans.language as keyof typeof translations] = {
              tracklist: trans.tracklist || '',
              description: trans.description || ''
            }
          }
        })

        // Get artist IDs
        const artistIds = release.release_artists?.map((ra: {artist_id: number}) => ra.artist_id) || []

        setFormData({
          url: release.url || '',
          title: release.title || '',
          format: release.format || 'CD',
          shop_url: release.shop_url || '',
          release_date: release.release_date || '',
          catalog_number: release.catalog_number || '',
          image_url: release.image_url || '',
          featured: release.featured || false,
          sort_order: release.sort_order || 0,
          spotify_url: release.spotify_url || '',
          apple_music_url: release.apple_music_url || '',
          youtube_music_url: release.youtube_music_url || '',
          amazon_music_url: release.amazon_music_url || '',
          bandcamp_url: release.bandcamp_url || '',
          soundcloud_url: release.soundcloud_url || '',
          meta_title: release.meta_title || '',
          meta_description: release.meta_description || '',
          translations,
          artistIds
        })
        
        // Extract storage path from image URL
        if (release.image_url) {
          const path = extractStoragePath(release.image_url)
          setImagePath(path)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load release')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      // Update release
      const { error: releaseError } = await supabase
        .from('releases')
        .update({
          url: formData.url,
          title: formData.title,
          format: formData.format,
          shop_url: formData.shop_url || null,
          release_date: formData.release_date || null,
          catalog_number: formData.catalog_number || null,
          image_url: formData.image_url || null,
          featured: formData.featured,
          sort_order: formData.sort_order,
          spotify_url: formData.spotify_url || null,
          apple_music_url: formData.apple_music_url || null,
          youtube_music_url: formData.youtube_music_url || null,
          amazon_music_url: formData.amazon_music_url || null,
          bandcamp_url: formData.bandcamp_url || null,
          soundcloud_url: formData.soundcloud_url || null,
          meta_title: formData.meta_title || null,
          meta_description: formData.meta_description || null,
        })
        .eq('id', releaseId)

      if (releaseError) throw releaseError

      // Update translations
      for (const [lang, content] of Object.entries(formData.translations)) {
        if (content.tracklist || content.description) {
          await supabase
            .from('release_translations')
            .upsert({
              release_id: parseInt(releaseId),
              language: lang,
              tracklist: content.tracklist || null,
              description: content.description || null
            })
        }
      }

      // Update artist associations
      // First, remove existing associations
      await supabase
        .from('release_artists')
        .delete()
        .eq('release_id', releaseId)

      // Then add new ones
      if (formData.artistIds.length > 0) {
        const releaseArtists = formData.artistIds.map(artistId => ({
          release_id: parseInt(releaseId),
          artist_id: artistId
        }))

        await supabase
          .from('release_artists')
          .insert(releaseArtists)
      }

      router.push('/dashboard/releases')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save release')
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

  const updateTranslation = (lang: 'en' | 'fr' | 'de', field: 'tracklist' | 'description', value: string) => {
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

  const toggleArtist = (artistId: number) => {
    setFormData(prev => ({
      ...prev,
      artistIds: prev.artistIds.includes(artistId)
        ? prev.artistIds.filter(id => id !== artistId)
        : [...prev.artistIds, artistId]
    }))
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
          href="/dashboard/releases"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Releases
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Release</h1>
            <p className="text-gray-600">Update release information and metadata</p>
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
              { id: 'content', name: 'Content & Artists' },
              { id: 'streaming', name: 'Streaming Links' },
              { id: 'seo', name: 'SEO & Metadata' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'basic' | 'content' | 'streaming' | 'seo')}
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
                  value={formData.url}
                  onChange={(e) => updateField('url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={formData.format}
                  onChange={(e) => updateField('format', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="CD">CD</option>
                  <option value="SACD">SACD</option>
                  <option value="Vinyl">Vinyl</option>
                  <option value="Digital">Digital</option>
                  <option value="Cassette">Cassette</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release Date
                </label>
                <input
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => updateField('release_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catalog Number
                </label>
                <input
                  type="text"
                  value={formData.catalog_number}
                  onChange={(e) => updateField('catalog_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shop URL
                </label>
                <input
                  type="text"
                  value={formData.shop_url}
                  onChange={(e) => updateField('shop_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <ImageUpload
                  bucket="releases"
                  folder={`release-${releaseId}`}
                  currentImageUrl={formData.image_url}
                  onUploadSuccess={handleImageUpload}
                  onUploadError={(error) => setError(error)}
                  onRemove={handleImageRemove}
                  label="Cover Image"
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
                  <span className="ml-2 text-sm text-gray-700">Featured Release</span>
                </label>
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
            </div>
          </div>
        )}

        {/* Content & Artists Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Artists Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Associated Artists</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {artists.map((artist) => (
                  <label key={artist.id} className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.artistIds.includes(artist.id)}
                      onChange={() => toggleArtist(artist.id)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="ml-3 text-sm text-gray-900">{artist.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Multilingual Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Content by Language</h3>
              
              <div className="space-y-6">
                {(['en', 'fr', 'de'] as const).map((lang) => (
                  <div key={lang} className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'German'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={formData.translations[lang].description}
                          onChange={(e) => updateTranslation(lang, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tracklist
                        </label>
                        <textarea
                          rows={5}
                          value={formData.translations[lang].tracklist}
                          onChange={(e) => updateTranslation(lang, 'tracklist', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="1. Track Title&#10;2. Another Track&#10;..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Streaming Links Tab */}
        {activeTab === 'streaming' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spotify URL
                </label>
                <input
                  type="text"
                  value={formData.spotify_url}
                  onChange={(e) => updateField('spotify_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apple Music URL
                </label>
                <input
                  type="text"
                  value={formData.apple_music_url}
                  onChange={(e) => updateField('apple_music_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Music URL
                </label>
                <input
                  type="text"
                  value={formData.youtube_music_url}
                  onChange={(e) => updateField('youtube_music_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amazon Music URL
                </label>
                <input
                  type="text"
                  value={formData.amazon_music_url}
                  onChange={(e) => updateField('amazon_music_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bandcamp URL
                </label>
                <input
                  type="text"
                  value={formData.bandcamp_url}
                  onChange={(e) => updateField('bandcamp_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SoundCloud URL
                </label>
                <input
                  type="text"
                  value={formData.soundcloud_url}
                  onChange={(e) => updateField('soundcloud_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => updateField('meta_title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.meta_description}
                  onChange={(e) => updateField('meta_description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/releases"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Release'}
          </button>
        </div>
      </form>
    </div>
  )
}