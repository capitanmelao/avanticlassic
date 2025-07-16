import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface NavCounts {
  artists: number
  releases: number
  videos: number
  playlists: number
  reviews: number
  distributors: number
  users: number
}

export function useNavCounts() {
  const [counts, setCounts] = useState<NavCounts>({
    artists: 0,
    releases: 0,
    videos: 0,
    playlists: 0,
    reviews: 0,
    distributors: 0,
    users: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCounts() {
      try {
        setLoading(true)
        setError(null)

        // Fetch all counts in parallel
        const [
          artistsResult,
          releasesResult,
          videosResult,
          playlistsResult,
          reviewsResult,
          distributorsResult,
          usersResult
        ] = await Promise.all([
          supabase.from('artists').select('id', { count: 'exact', head: true }),
          supabase.from('releases').select('id', { count: 'exact', head: true }),
          supabase.from('videos').select('id', { count: 'exact', head: true }),
          supabase.from('playlists').select('id', { count: 'exact', head: true }),
          supabase.from('reviews').select('id', { count: 'exact', head: true }),
          supabase.from('distributors').select('id', { count: 'exact', head: true }),
          supabase.from('admin_users').select('id', { count: 'exact', head: true })
        ])

        // Check for any errors
        const errors = [
          artistsResult.error,
          releasesResult.error,
          videosResult.error,
          playlistsResult.error,
          reviewsResult.error,
          distributorsResult.error,
          usersResult.error
        ].filter(Boolean)

        if (errors.length > 0) {
          console.error('Error fetching counts:', errors)
          setError('Failed to fetch navigation counts')
          return
        }

        setCounts({
          artists: artistsResult.count || 0,
          releases: releasesResult.count || 0,
          videos: videosResult.count || 0,
          playlists: playlistsResult.count || 0,
          reviews: reviewsResult.count || 0,
          distributors: distributorsResult.count || 0,
          users: usersResult.count || 0
        })
      } catch (err) {
        console.error('Error fetching navigation counts:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  return { counts, loading, error }
}