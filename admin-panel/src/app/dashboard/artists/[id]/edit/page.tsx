'use client'

import { useSession } from '@/lib/use-session'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Artist } from '@/lib/supabase'
import Link from 'next/link'

export default function EditArtistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const artistId = params.id as string
  
  const [artist, setArtist] = useState<Artist | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    facebook: '',
    image_url: '',
    featured: false
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

  useEffect(() => {
    if (artistId) {
      loadArtist()
    }
  }, [artistId]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadArtist = async () => {
    try {
      setLoading(true)
      
      // Load artist basic info
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .select('*')
        .eq('id', artistId)
        .single()

      if (artistError) {
        throw artistError
      }

      // Load artist translations
      const { data: translationsData, error: translationsError } = await supabase
        .from('artist_translations')
        .select('*')
        .eq('artist_id', artistId)

      if (translationsError) {
        console.warn('Failed to load translations:', translationsError)
      }

      setArtist(artistData)
      setFormData({
        name: artistData.name || '',
        url: artistData.url || '',
        facebook: artistData.facebook || '',
        image_url: artistData.image_url || '',
        featured: artistData.featured || false
      })

      // Set translations
      const translationsMap = {
        en: '',
        fr: '',
        de: ''
      }
      
      if (translationsData) {
        translationsData.forEach((translation: { language: string; description: string }) => {
          if (translation.language && translation.description) {
            translationsMap[translation.language as keyof typeof translationsMap] = translation.description
          }
        })
      }
      
      setTranslations(translationsMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artist')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      // Update artist basic info
      const { error: artistError } = await supabase
        .from('artists')
        .update({
          name: formData.name,
          url: formData.url,
          facebook: formData.facebook || null,
          image_url: formData.image_url || null,
          featured: formData.featured,
          updated_at: new Date().toISOString()
        })
        .eq('id', artistId)

      if (artistError) throw artistError

      // Update translations
      const languages = ['en', 'fr', 'de'] as const
      
      for (const lang of languages) {
        const description = translations[lang].trim()
        
        if (description) {
          // Insert or update translation
          const { error: upsertError } = await supabase
            .from('artist_translations')
            .upsert({
              artist_id: parseInt(artistId),
              language: lang,
              description: description,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'artist_id,language'
            })
          
          if (upsertError) throw upsertError
        } else {
          // Delete empty translation
          const { error: deleteError } = await supabase
            .from('artist_translations')
            .delete()
            .eq('artist_id', artistId)
            .eq('language', lang)
          
          if (deleteError) console.warn(`Failed to delete ${lang} translation:`, deleteError)
        }
      }

      router.push('/dashboard/artists')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update artist')
    } finally {
      setSaving(false)
    }
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

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Artist Not Found</h1>
          <p className="mt-2 text-gray-600">The artist you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/dashboard/artists"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Artists
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/artists"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ← Back to Artists
        </Link>
      </div>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Artist</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update artist information and profile details.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Artist name and URL slug for the website.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Artist Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      name="url"
                      id="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="artist-name-slug"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Used in the website URL. Use lowercase letters and hyphens only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Social & Media</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Social media links and profile image.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      id="facebook"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://facebook.com/artist"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                      Profile Image URL
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Display Options</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Control how this artist appears on the website.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="featured" className="font-medium text-gray-700">
                        Featured Artist
                      </label>
                      <p className="text-gray-500">
                        Featured artists appear prominently on the homepage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Biography (Multilingual)</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Artist biography in English, French, and German. These will appear on the artist profile pages.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="bio_en" className="block text-sm font-medium text-gray-700">
                      English Biography
                    </label>
                    <textarea
                      id="bio_en"
                      name="bio_en"
                      rows={4}
                      value={translations.en}
                      onChange={(e) => setTranslations({ ...translations, en: e.target.value })}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Artist biography in English..."
                    />
                  </div>

                  <div>
                    <label htmlFor="bio_fr" className="block text-sm font-medium text-gray-700">
                      French Biography (Biographie française)
                    </label>
                    <textarea
                      id="bio_fr"
                      name="bio_fr"
                      rows={4}
                      value={translations.fr}
                      onChange={(e) => setTranslations({ ...translations, fr: e.target.value })}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Biographie de l'artiste en français..."
                    />
                  </div>

                  <div>
                    <label htmlFor="bio_de" className="block text-sm font-medium text-gray-700">
                      German Biography (Deutsche Biografie)
                    </label>
                    <textarea
                      id="bio_de"
                      name="bio_de"
                      rows={4}
                      value={translations.de}
                      onChange={(e) => setTranslations({ ...translations, de: e.target.value })}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Künstlerbiografie auf Deutsch..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              href="/dashboard/artists"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}