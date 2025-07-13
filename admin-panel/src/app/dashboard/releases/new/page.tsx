'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NewReleasePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlCheckLoading, setUrlCheckLoading] = useState(false)
  const [urlExists, setUrlExists] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    shop_url: '',
    release_date: '',
    catalog_number: '',
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

  const generateUrlSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const checkUrlAvailability = async (url: string) => {
    if (!url.trim()) {
      setUrlExists(false)
      return
    }

    setUrlCheckLoading(true)
    try {
      const { data, error } = await supabase
        .from('releases')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (urlExists) {
      setError('Cannot create release: URL slug already exists. Please choose a different URL slug.')
      return
    }
    
    if (!formData.title.trim() || !formData.url.trim()) {
      setError('Release title and URL slug are required.')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const releasePayload = {
        title: formData.title,
        url: formData.url,
        shop_url: formData.shop_url || null,
        release_date: formData.release_date || null,
        catalog_number: formData.catalog_number || null,
        image_url: formData.image_url || null,
        featured: formData.featured,
        sort_order: 0
      }
      
      console.log('Creating release with payload:', releasePayload)
      
      // Create release
      const { data: releaseData, error: releaseError } = await supabase
        .from('releases')
        .insert([releasePayload])
        .select()
        .single()

      if (releaseError) throw releaseError

      // Create translations if provided
      const languages = ['en', 'fr', 'de'] as const
      const translationsToInsert = []

      for (const lang of languages) {
        const tracklist = translations[lang].trim()
        if (tracklist) {
          translationsToInsert.push({
            release_id: releaseData.id,
            language: lang,
            tracklist: tracklist
          })
        }
      }

      if (translationsToInsert.length > 0) {
        const { error: translationsError } = await supabase
          .from('release_translations')
          .insert(translationsToInsert)

        if (translationsError) {
          console.warn('Failed to create some translations:', translationsError)
          // Don't fail the whole operation for translation errors
        }
      }

      router.push('/dashboard/releases')
    } catch (err) {
      console.error('Create release error:', err)
      if (err instanceof Error) {
        if (err.message.includes('releases_pkey')) {
          setError('Database ID conflict. Please try again.')
        } else if (err.message.includes('releases_url_key') || err.message.includes('duplicate key')) {
          setError(`A release with URL slug "${formData.url}" already exists. Please choose a different URL slug.`)
        } else if (err.message.includes('23505')) {
          if (err.message.includes('releases_url_key')) {
            setError(`URL slug "${formData.url}" is already taken. Please choose a different one.`)
          } else {
            setError('A duplicate entry was detected. Please check your input and try again.')
          }
        } else {
          setError(`Failed to create release: ${err.message}`)
        }
      } else {
        setError('Failed to create release: Unknown error occurred')
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
            Add New Release
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/dashboard/releases"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Releases
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
                Release title and URL slug for the website.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Release Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="e.g., Goldberg Variations"
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
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm ${
                        urlExists ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="e.g., goldberg-variations"
                    />
                    {urlCheckLoading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
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
                    This will be used in the URL: /releases/{formData.url}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Release Details</h3>
              <p className="mt-1 text-sm text-gray-500">
                Additional information about the release.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="release_date" className="block text-sm font-medium text-gray-700">
                    Release Date
                  </label>
                  <input
                    type="date"
                    id="release_date"
                    value={formData.release_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, release_date: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="catalog_number" className="block text-sm font-medium text-gray-700">
                    Catalog Number
                  </label>
                  <input
                    type="text"
                    id="catalog_number"
                    value={formData.catalog_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, catalog_number: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="e.g., AC-001"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="shop_url" className="block text-sm font-medium text-gray-700">
                    Shop URL
                  </label>
                  <input
                    type="url"
                    id="shop_url"
                    value={formData.shop_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, shop_url: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="https://store.example.com/album"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
                    Cover Art URL
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="https://example.com/cover.jpg"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    💡 For existing releases, cover art is available at: <code>/images/releases/{'{'}id{'}'}.jpeg</code>
                  </p>
                </div>

                <div className="col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="featured"
                        name="featured"
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="featured" className="font-medium text-gray-700">
                        Featured Release
                      </label>
                      <p className="text-gray-500">
                        Featured releases appear prominently on the homepage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Tracklist (Multilingual)
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Track listings in English, French, and German.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="space-y-6">
                <div>
                  <label htmlFor="tracklist_en" className="block text-sm font-medium text-gray-700">
                    English Tracklist
                  </label>
                  <textarea
                    id="tracklist_en"
                    rows={4}
                    value={translations.en}
                    onChange={(e) => setTranslations(prev => ({ ...prev, en: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="1. Track One&#10;2. Track Two&#10;3. Track Three"
                  />
                </div>

                <div>
                  <label htmlFor="tracklist_fr" className="block text-sm font-medium text-gray-700">
                    French Tracklist (Liste des pistes)
                  </label>
                  <textarea
                    id="tracklist_fr"
                    rows={4}
                    value={translations.fr}
                    onChange={(e) => setTranslations(prev => ({ ...prev, fr: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="1. Première piste&#10;2. Deuxième piste&#10;3. Troisième piste"
                  />
                </div>

                <div>
                  <label htmlFor="tracklist_de" className="block text-sm font-medium text-gray-700">
                    German Tracklist (Titelliste)
                  </label>
                  <textarea
                    id="tracklist_de"
                    rows={4}
                    value={translations.de}
                    onChange={(e) => setTranslations(prev => ({ ...prev, de: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="1. Erster Titel&#10;2. Zweiter Titel&#10;3. Dritter Titel"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/releases"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || urlExists || !formData.title || !formData.url}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Release'}
          </button>
        </div>
      </form>
    </div>
  )
}