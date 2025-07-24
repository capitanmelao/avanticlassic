'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Release {
  id: number
  url: string
  title: string
  shop_url?: string
  release_date?: string
  catalog_number?: string
  image_url?: string
  featured: boolean
  sort_order: number
  price?: number
  stripe_payment_link?: string
  created_at?: string
  updated_at?: string
}

interface ReleaseFormData {
  title: string
  url: string
  shop_url: string
  release_date: string
  catalog_number: string
  featured: boolean
  price: string
  stripe_payment_link: string
}

export default function EditReleasePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [release, setRelease] = useState<Release | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ReleaseFormData>({
    title: '',
    url: '',
    shop_url: '',
    release_date: '',
    catalog_number: '',
    featured: false,
    price: '',
    stripe_payment_link: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (params.id) {
      loadRelease()
    }
  }, [params.id])

  const loadRelease = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setRelease(data)
        setFormData({
          title: data.title || '',
          url: data.url || '',
          shop_url: data.shop_url || '',
          release_date: data.release_date || '',
          catalog_number: data.catalog_number || '',
          featured: data.featured || false,
          price: data.price ? data.price.toString() : '',
          stripe_payment_link: data.stripe_payment_link || ''
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load release')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const updateData: any = {
        title: formData.title,
        url: formData.url,
        shop_url: formData.shop_url || null,
        release_date: formData.release_date || null,
        catalog_number: formData.catalog_number || null,
        featured: formData.featured,
        stripe_payment_link: formData.stripe_payment_link || null
      }

      // Only include price if it's a valid number
      if (formData.price && formData.price.trim() !== '') {
        const priceValue = parseFloat(formData.price)
        if (!isNaN(priceValue) && priceValue >= 0) {
          updateData.price = priceValue
        }
      } else {
        updateData.price = null
      }

      const { error } = await supabase
        .from('releases')
        .update(updateData)
        .eq('id', params.id)

      if (error) {
        throw error
      }

      router.push('/dashboard/releases')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update release')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
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

  if (!release) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Release Not Found</h1>
          <Link
            href="/dashboard/releases"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Releases
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard/releases"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ← Back to Releases
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Release</h1>
        <p className="mt-2 text-sm text-gray-700">
          Update release information including pricing and payment links for simplified checkout.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL Slug *
              </label>
              <input
                type="text"
                name="url"
                id="url"
                required
                value={formData.url}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="catalog_number" className="block text-sm font-medium text-gray-700">
                Catalog Number
              </label>
              <input
                type="text"
                name="catalog_number"
                id="catalog_number"
                value={formData.catalog_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="release_date" className="block text-sm font-medium text-gray-700">
                Release Date
              </label>
              <input
                type="date"
                name="release_date"
                id="release_date"
                value={formData.release_date}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="shop_url" className="block text-sm font-medium text-gray-700">
                Shop URL (Legacy)
              </label>
              <input
                type="url"
                name="shop_url"
                id="shop_url"
                value={formData.shop_url}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Featured Release
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
          <p className="text-sm text-gray-600 mb-4">
            Set pricing and Stripe Payment Link for simplified checkout (replaces complex cart system).
          </p>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (EUR)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="pl-7 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="stripe_payment_link" className="block text-sm font-medium text-gray-700">
                Stripe Payment Link
              </label>
              <input
                type="url"
                name="stripe_payment_link"
                id="stripe_payment_link"
                value={formData.stripe_payment_link}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://buy.stripe.com/..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Create payment links in your Stripe Dashboard and paste the URL here
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/dashboard/releases"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}