'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

interface FormData {
  name: string
  email: string
  phone: string
  website: string
  address: string
  country_id: string
  logo: string
}

export default function NewDistributorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    country_id: '',
    logo: ''
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)

      const { error: insertError } = await supabase
        .from('distributors')
        .insert({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          website: formData.website || null,
          address: formData.address || null,
          country_id: formData.country_id || null,
          logo: formData.logo || null,
        })

      if (insertError) throw insertError

      router.push('/dashboard/distributors')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create distributor')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'uk', name: 'United Kingdom' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'it', name: 'Italy' },
    { code: 'es', name: 'Spain' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'jp', name: 'Japan' },
    { code: 'kr', name: 'South Korea' },
    { code: 'cn', name: 'China' },
    { code: 'br', name: 'Brazil' },
    { code: 'mx', name: 'Mexico' },
    { code: 'ar', name: 'Argentina' },
    { code: 'ch', name: 'Switzerland' },
    { code: 'at', name: 'Austria' },
    { code: 'be', name: 'Belgium' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'se', name: 'Sweden' },
    { code: 'no', name: 'Norway' },
    { code: 'dk', name: 'Denmark' },
    { code: 'fi', name: 'Finland' },
    { code: 'pl', name: 'Poland' },
    { code: 'cz', name: 'Czech Republic' },
    { code: 'hu', name: 'Hungary' },
    { code: 'ro', name: 'Romania' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'hr', name: 'Croatia' },
    { code: 'si', name: 'Slovenia' },
    { code: 'sk', name: 'Slovakia' },
    { code: 'ee', name: 'Estonia' },
    { code: 'lv', name: 'Latvia' },
    { code: 'lt', name: 'Lithuania' },
    { code: 'ie', name: 'Ireland' },
    { code: 'pt', name: 'Portugal' },
    { code: 'gr', name: 'Greece' }
  ]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/distributors"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Distributors
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Distributor</h1>
            <p className="text-gray-600">Create a new distribution partner</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={formData.country_id}
                onChange={(e) => updateField('country_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select country...</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => updateField('logo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Full business address..."
              />
            </div>
          </div>

          {/* Logo Preview */}
          {formData.logo && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Preview:</label>
              <img
                src={formData.logo}
                alt="Logo preview"
                className="h-16 w-16 object-contain rounded-md border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Link
            href="/dashboard/distributors"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Creating...' : 'Create Distributor'}
          </button>
        </div>
      </form>
    </div>
  )
}