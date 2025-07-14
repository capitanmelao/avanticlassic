'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Release } from '@/lib/supabase'
import { ChevronLeftIcon, StarIcon } from '@heroicons/react/24/outline'

interface FormData {
  release_id: number | null
  publication: string
  reviewer_name: string
  review_date: string
  rating: number | null
  review_text: string
  review_url: string
  featured: boolean
  sort_order: number
  // Translations
  translations: {
    en: { review_text: string }
    fr: { review_text: string }
    de: { review_text: string }
  }
}

export default function NewReviewPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    release_id: null,
    publication: '',
    reviewer_name: '',
    review_date: new Date().toISOString().split('T')[0],
    rating: null,
    review_text: '',
    review_url: '',
    featured: false,
    sort_order: 0,
    translations: {
      en: { review_text: '' },
      fr: { review_text: '' },
      de: { review_text: '' }
    }
  })

  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'basic' | 'content'>('basic')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      if (!formData.release_id) {
        throw new Error('Please select a release')
      }

      // Create review
      const { data: review, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          release_id: formData.release_id,
          publication: formData.publication,
          reviewer_name: formData.reviewer_name || null,
          review_date: formData.review_date,
          rating: formData.rating,
          review_text: formData.review_text,
          review_url: formData.review_url || null,
          featured: formData.featured,
          sort_order: formData.sort_order,
        })
        .select()
        .single()

      if (reviewError) throw reviewError

      // Add translations
      const translations = []
      for (const [lang, content] of Object.entries(formData.translations)) {
        if (content.review_text && content.review_text !== formData.review_text) {
          translations.push({
            review_id: review.id,
            language: lang,
            review_text: content.review_text
          })
        }
      }

      if (translations.length > 0) {
        await supabase
          .from('review_translations')
          .insert(translations)
      }

      router.push('/dashboard/reviews')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create review')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof FormData, value: string | number | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateTranslation = (lang: 'en' | 'fr' | 'de', field: 'review_text', value: string) => {
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

  const setRating = (rating: number) => {
    updateField('rating', formData.rating === rating ? null : rating)
  }

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`p-1 transition-colors ${
              formData.rating && star <= formData.rating
                ? 'text-yellow-400 hover:text-yellow-500'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <StarIcon 
              className={`h-6 w-6 ${
                formData.rating && star <= formData.rating ? 'fill-current' : ''
              }`} 
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating ? `${formData.rating}/5` : 'No rating'}
        </span>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/reviews"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Reviews
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Review</h1>
            <p className="text-gray-600">Create a new press review or critique</p>
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
              { id: 'content', name: 'Content & Translations' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as 'basic' | 'content')}
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
              {/* Release Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Release *
                </label>
                <select
                  required
                  value={formData.release_id || ''}
                  onChange={(e) => updateField('release_id', parseInt(e.target.value) || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select a release...</option>
                  {releases.map((release) => (
                    <option key={release.id} value={release.id}>
                      {release.title} ({release.catalog_number})
                    </option>
                  ))}
                </select>
                {loading && (
                  <p className="mt-1 text-sm text-gray-500">Loading releases...</p>
                )}
              </div>

              {/* Publication */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication *
                </label>
                <input
                  type="text"
                  required
                  value={formData.publication}
                  onChange={(e) => updateField('publication', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Classical Music Magazine"
                />
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reviewer Name
                </label>
                <input
                  type="text"
                  value={formData.reviewer_name}
                  onChange={(e) => updateField('reviewer_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., John Smith"
                />
              </div>

              {/* Review Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.review_date}
                  onChange={(e) => updateField('review_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Review URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review URL
                </label>
                <input
                  type="url"
                  value={formData.review_url}
                  onChange={(e) => updateField('review_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://example.com/review"
                />
              </div>

              {/* Rating */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5 stars)
                </label>
                {renderStarRating()}
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

              {/* Featured Review */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => updateField('featured', e.target.checked)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Review</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Content & Translations Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Main Review Text */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Content</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Text *
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.review_text}
                  onChange={(e) => updateField('review_text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter the review content..."
                />
              </div>
            </div>

            {/* Translations */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Translations (Optional)</h3>
              
              <div className="space-y-6">
                {(['en', 'fr', 'de'] as const).map((lang) => (
                  <div key={lang} className="border border-gray-200 rounded-md p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'German'}
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review Text
                      </label>
                      <textarea
                        rows={4}
                        value={formData.translations[lang].review_text}
                        onChange={(e) => updateTranslation(lang, 'review_text', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder={`Review text in ${lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'German'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/reviews"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Creating...' : 'Create Review'}
          </button>
        </div>
      </form>
    </div>
  )
}