'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Distributor } from '@/lib/supabase'
import Link from 'next/link'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function DistributorsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadDistributors()
  }, [])

  const loadDistributors = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .order('name')

      if (error) {
        throw error
      }

      setDistributors(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load distributors')
    } finally {
      setLoading(false)
    }
  }

  const deleteDistributor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this distributor?')) return

    try {
      const { error } = await supabase
        .from('distributors')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setDistributors(distributors.filter(d => d.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete distributor')
    }
  }

  const filteredDistributors = distributors.filter(distributor => {
    const matchesSearch = 
      distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.country_id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCountry = selectedCountry === 'all' || distributor.country_id === selectedCountry
    
    return matchesSearch && matchesCountry
  })

  const countries = Array.from(new Set(distributors.map(d => d.country_id).filter(Boolean))).sort()

  const getCountryFlag = (countryCode: string | null) => {
    if (!countryCode) return '🌍'
    
    const flags: { [key: string]: string } = {
      'us': '🇺🇸', 'uk': '🇬🇧', 'de': '🇩🇪', 'fr': '🇫🇷', 'it': '🇮🇹', 'es': '🇪🇸',
      'ca': '🇨🇦', 'au': '🇦🇺', 'jp': '🇯🇵', 'kr': '🇰🇷', 'cn': '🇨🇳', 'br': '🇧🇷',
      'mx': '🇲🇽', 'ar': '🇦🇷', 'ch': '🇨🇭', 'at': '🇦🇹', 'be': '🇧🇪', 'nl': '🇳🇱',
      'se': '🇸🇪', 'no': '🇳🇴', 'dk': '🇩🇰', 'fi': '🇫🇮', 'pl': '🇵🇱', 'cz': '🇨🇿',
      'hu': '🇭🇺', 'ro': '🇷🇴', 'bg': '🇧🇬', 'hr': '🇭🇷', 'si': '🇸🇮', 'sk': '🇸🇰',
      'ee': '🇪🇪', 'lv': '🇱🇻', 'lt': '🇱🇹', 'ie': '🇮🇪', 'pt': '🇵🇹', 'gr': '🇬🇷'
    }
    
    return flags[countryCode.toLowerCase()] || '🌍'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Distributors</h1>
          <p className="text-gray-600">Manage distribution partners worldwide</p>
        </div>
        <Link
          href="/dashboard/distributors/new"
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Distributor
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search distributors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Country Filter */}
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="all">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {getCountryFlag(country)} {country?.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Distributors Grid */}
      {filteredDistributors.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <GlobeAltIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No distributors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCountry !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first distributor.'
            }
          </p>
          {(!searchTerm && selectedCountry === 'all') && (
            <div className="mt-6">
              <Link
                href="/dashboard/distributors/new"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Distributor
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDistributors.map((distributor) => (
            <div
              key={distributor.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* Header with Logo */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  {distributor.logo ? (
                    <img
                      src={distributor.logo}
                      alt={distributor.name}
                      className="h-12 w-12 object-contain rounded-md border border-gray-200"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
                      <GlobeAltIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {distributor.name}
                    </h3>
                    {distributor.country_id && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">{getCountryFlag(distributor.country_id)}</span>
                        {distributor.country_id.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  {distributor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a
                        href={`mailto:${distributor.email}`}
                        className="hover:text-blue-600 truncate"
                      >
                        {distributor.email}
                      </a>
                    </div>
                  )}
                  
                  {distributor.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a
                        href={`tel:${distributor.phone}`}
                        className="hover:text-blue-600"
                      >
                        {distributor.phone}
                      </a>
                    </div>
                  )}

                  {distributor.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-400" />
                      <a
                        href={distributor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 truncate"
                      >
                        {distributor.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>

                {/* Address */}
                {distributor.address && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {distributor.address}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/dashboard/distributors/${distributor.id}/edit`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteDistributor(distributor.id)}
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-900">{distributors.length}</span> total distributors
          </div>
          <div>
            <span className="font-medium text-gray-900">{countries.length}</span> countries
          </div>
          <div>
            <span className="font-medium text-gray-900">
              {distributors.filter(d => d.email).length}
            </span> with email contact
          </div>
        </div>
      </div>
    </div>
  )
}