'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function NewArtistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlCheckLoading, setUrlCheckLoading] = useState(false)
  const [urlExists, setUrlExists] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    facebook: ''
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

  const generateUrlSlug = (name: string) => {
    return name
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
        .from('artists')
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

  const handleNameChange = (name: string) => {
    const newUrl = generateUrlSlug(name)
    setFormData(prev => ({
      ...prev,
      name,
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
      setError('Cannot create artist: URL slug already exists. Please choose a different URL slug.')
      return
    }
    
    if (!formData.name.trim() || !formData.url.trim()) {
      setError('Artist name and URL slug are required.')
      return
    }
    
    setLoading(true)
    setError(null)

    try {
      const artistPayload = {
        name: formData.name,
        url: formData.url,
        facebook: formData.facebook || null,
        image_url: null,
        featured: false,
        sort_order: 0
      }
      
      console.log('Creating artist with payload:', artistPayload)
      
      // Create artist
      const { data: artistData, error: artistError } = await supabase
        .from('artists')
        .insert([artistPayload])
        .select()
        .single()

      if (artistError) throw artistError

      // Create translations if provided
      const languages = ['en', 'fr', 'de'] as const
      const translationsToInsert = []

      for (const lang of languages) {
        const description = translations[lang].trim()
        if (description) {
          translationsToInsert.push({
            artist_id: artistData.id,
            language: lang,
            description: description
          })
        }
      }

      if (translationsToInsert.length > 0) {
        const { error: translationsError } = await supabase
          .from('artist_translations')
          .insert(translationsToInsert)

        if (translationsError) {
          console.warn('Failed to create some translations:', translationsError)
          // Don't fail the whole operation for translation errors
        }
      }

      router.push('/dashboard/artists')
    } catch (err) {
      console.error('Create artist error:', err)
      if (err instanceof Error) {
        if (err.message.includes('artists_pkey')) {
          setError('Database ID conflict. Please try again.')
        } else if (err.message.includes('artists_url_key') || err.message.includes('duplicate key')) {
          setError(`An artist with URL slug "${formData.url}" already exists. Please choose a different URL slug.`)
        } else if (err.message.includes('23505')) {
          if (err.message.includes('artists_url_key')) {
            setError(`URL slug "${formData.url}" is already taken. Please choose a different one.`)
          } else {
            setError('A duplicate entry was detected. Please check your input and try again.')
          }
        } else {
          setError(`Failed to create artist: ${err.message}`)
        }
      } else {
        setError('Failed to create artist: Unknown error occurred')
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
            Add New Artist
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/dashboard/artists"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Artists
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
                Artist name and URL slug for the website.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., Martha Argerich"
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
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        urlExists ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      placeholder="e.g., martha-argerich"
                    />
                    {urlCheckLoading && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
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
                    This will be used in the URL: /artists/{formData.url}
                  </p>
                </div>

                <div className="col-span-6">
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData(prev => ({ ...prev, facebook: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://www.facebook.com/..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Biography (Multilingual)
              </h3>
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
                    rows={4}
                    value={translations.en}
                    onChange={(e) => setTranslations(prev => ({ ...prev, en: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Artist biography in English..."
                  />
                </div>

                <div>
                  <label htmlFor="bio_fr" className="block text-sm font-medium text-gray-700">
                    French Biography (Biographie française)
                  </label>
                  <textarea
                    id="bio_fr"
                    rows={4}
                    value={translations.fr}
                    onChange={(e) => setTranslations(prev => ({ ...prev, fr: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Biographie de l'artiste en français..."
                  />
                </div>

                <div>
                  <label htmlFor="bio_de" className="block text-sm font-medium text-gray-700">
                    German Biography (Deutsche Biografie)
                  </label>
                  <textarea
                    id="bio_de"
                    rows={4}
                    value={translations.de}
                    onChange={(e) => setTranslations(prev => ({ ...prev, de: e.target.value }))}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Künstlerbiografie auf Deutsch..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/dashboard/artists"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || urlExists || !formData.name || !formData.url}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Artist'}
          </button>
        </div>
      </form>
    </div>
  )
}