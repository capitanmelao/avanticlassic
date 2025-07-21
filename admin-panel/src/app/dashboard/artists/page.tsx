'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Artist } from '@/lib/supabase'
import Link from 'next/link'
import { ResponsiveTable } from '@/components/responsive-table'

export default function ArtistsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadArtists()
  }, [])

  const loadArtists = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name')

      if (error) {
        throw error
      }

      setArtists(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load artists')
    } finally {
      setLoading(false)
    }
  }

  const deleteArtist = async (id: number) => {
    if (!confirm('Are you sure you want to delete this artist?')) return

    try {
      const { error } = await supabase
        .from('artists')
        .delete()
        .eq('id', id)

      if (error) throw error

      setArtists(artists.filter(artist => artist.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete artist')
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
    <div className="p-6">

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Artists</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage classical music artists and their profiles.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/artists/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Artist
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* Responsive Table */}
      <div className="mt-8">
        <ResponsiveTable
          loading={loading}
          columns={[
            {
              key: 'name',
              title: 'Name',
              width: 200,
              minWidth: 150
            },
            {
              key: 'url',
              title: 'URL Slug',
              width: 150,
              minWidth: 120
            },
            {
              key: 'facebook',
              title: 'Facebook',
              width: 120,
              minWidth: 100,
              render: (value) => value ? (
                <a
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                >
                  Facebook
                </a>
              ) : '—'
            },
            {
              key: 'updated_at',
              title: 'Updated',
              width: 120,
              minWidth: 100,
              render: (value) => value ? new Date(String(value)).toLocaleDateString() : '—'
            },
            {
              key: 'actions',
              title: 'Actions',
              width: 120,
              minWidth: 100,
              render: (_, artist) => (
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/artists/${artist.id}/edit`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteArtist(artist.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )
            }
          ]}
          data={artists}
          emptyMessage="No artists found. Create your first artist to get started."
        />
      </div>

    </div>
  )
}