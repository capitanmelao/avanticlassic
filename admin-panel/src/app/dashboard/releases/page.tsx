'use client'

import { useSession } from 'next-auth/react'
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
  created_at?: string
  updated_at?: string
}

export default function ReleasesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadReleases()
  }, [])

  const loadReleases = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .order('release_date', { ascending: false })

      if (error) {
        throw error
      }

      setReleases(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load releases')
    } finally {
      setLoading(false)
    }
  }

  const deleteRelease = async (id: number) => {
    if (!confirm('Are you sure you want to delete this release?')) return

    try {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id)

      if (error) throw error

      setReleases(releases.filter(release => release.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete release')
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Releases</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage album releases, EPs, and single recordings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/releases/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Release
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="mt-8 hidden lg:block">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL Slug
                </th>
                <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Release Date
                </th>
                <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th scope="col" className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {releases.map((release) => (
                <tr key={release.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {release.image_url ? (
                          <img
                            className="h-12 w-12 rounded-md object-cover border border-gray-200"
                            src={release.image_url.startsWith('http') 
                              ? release.image_url 
                              : `https://avanticlassic.vercel.app${release.image_url}`
                            }
                            alt={release.title}
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              const fallback = img.nextElementSibling as HTMLElement;
                              img.style.display = 'none';
                              if (fallback) fallback.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center border border-gray-300 ${release.image_url ? 'hidden' : ''}`}>
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {release.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {release.catalog_number}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {release.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {release.release_date ? new Date(release.release_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {release.featured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/releases/${release.id}/edit`}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteRelease(release.id)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="mt-8 lg:hidden">
        <div className="space-y-4">
          {releases.map((release) => (
            <div key={release.id} className="bg-white shadow rounded-lg border border-gray-200">
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {release.image_url ? (
                      <img
                        className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                        src={release.image_url.startsWith('http') 
                          ? release.image_url 
                          : `https://avanticlassic.vercel.app${release.image_url}`
                        }
                        alt={release.title}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          const fallback = img.nextElementSibling as HTMLElement;
                          img.style.display = 'none';
                          if (fallback) fallback.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-300 ${release.image_url ? 'hidden' : ''}`}>
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {release.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          URL: {release.url}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          {release.release_date && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {new Date(release.release_date).toLocaleDateString()}
                            </span>
                          )}
                          {release.catalog_number && (
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {release.catalog_number}
                            </span>
                          )}
                          {release.featured && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Link
                        href={`/dashboard/releases/${release.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteRelease(release.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {releases.length === 0 && !loading && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No releases</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first release.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard/releases/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Release
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}