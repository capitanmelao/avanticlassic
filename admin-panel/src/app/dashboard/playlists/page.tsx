'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase, type Playlist } from '@/lib/supabase'
import Link from 'next/link'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface PlaylistWithTracks extends Playlist {
  track_count?: number
}

export default function PlaylistsPage() {
  const { status } = useSession()
  const router = useRouter()
  const [playlists, setPlaylists] = useState<PlaylistWithTracks[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_tracks(count)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Transform data to include track count
      const playlistsWithCounts = (data || []).map(playlist => ({
        ...playlist,
        track_count: playlist.playlist_tracks?.[0]?.count || 0
      }))

      setPlaylists(playlistsWithCounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlists')
    } finally {
      setLoading(false)
    }
  }

  const deletePlaylist = async (id: number) => {
    if (!confirm('Are you sure you want to delete this playlist? This will also remove all associated tracks.')) return

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setPlaylists(playlists.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playlist')
    }
  }

  const toggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('playlists')
        .update({ featured: !currentFeatured })
        .eq('id', id)

      if (error) {
        throw error
      }

      setPlaylists(playlists.map(p => 
        p.id === id ? { ...p, featured: !currentFeatured } : p
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update playlist')
    }
  }

  const filteredPlaylists = playlists.filter(playlist => {
    const matchesSearch = playlist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      playlist.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || playlist.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'by_artist': return 'By Artist'
      case 'by_composer': return 'By Composer'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'by_artist': return 'bg-blue-100 text-blue-800'
      case 'by_composer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
          <p className="text-gray-600">Manage curated playlists by artist and composer</p>
        </div>
        <Link
          href="/dashboard/playlists/new"
          className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Playlist
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
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
        >
          <option value="all">All Categories</option>
          <option value="by_artist">By Artist</option>
          <option value="by_composer">By Composer</option>
        </select>
      </div>

      {/* Playlists Grid */}
      {filteredPlaylists.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm12-3c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No playlists found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first playlist.'
            }
          </p>
          {(!searchTerm && selectedCategory === 'all') && (
            <div className="mt-6">
              <Link
                href="/dashboard/playlists/new"
                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Playlist
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* Playlist Image */}
              <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                {playlist.image_url ? (
                  <img
                    src={playlist.image_url}
                    alt={playlist.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2zm12-3c0 1.105-.895 2-2 2s-2-.895-2-2 .895-2 2-2 2 .895 2 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {playlist.title}
                  </h3>
                  <button
                    onClick={() => toggleFeatured(playlist.id, playlist.featured)}
                    className={`ml-2 p-1 rounded-full transition-colors ${
                      playlist.featured 
                        ? 'text-yellow-500 hover:text-yellow-600' 
                        : 'text-gray-400 hover:text-yellow-500'
                    }`}
                    title={playlist.featured ? 'Remove from featured' : 'Add to featured'}
                  >
                    <StarIcon className={`h-5 w-5 ${playlist.featured ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {playlist.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {playlist.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-3">
                  {playlist.category && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(playlist.category)}`}>
                      {getCategoryLabel(playlist.category)}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {playlist.track_count} track{playlist.track_count !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* External Links */}
                {(playlist.spotify_url || playlist.apple_music_url || playlist.youtube_url) && (
                  <div className="flex space-x-2 mb-3">
                    {playlist.spotify_url && (
                      <a
                        href={playlist.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Spotify
                      </a>
                    )}
                    {playlist.apple_music_url && (
                      <a
                        href={playlist.apple_music_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        Apple Music
                      </a>
                    )}
                    {playlist.youtube_url && (
                      <a
                        href={playlist.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/dashboard/playlists/${playlist.id}/edit`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePlaylist(playlist.id)}
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
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total playlists: {playlists.length}</span>
          <span>Featured: {playlists.filter(p => p.featured).length}</span>
        </div>
      </div>
    </div>
  )
}