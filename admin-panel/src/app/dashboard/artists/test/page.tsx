'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function TestArtistsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...')
  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Testing Supabase connection...')
      
      // Test basic connection
      const { data, error: connectionError } = await supabase
        .from('artists')
        .select('*')
        .limit(5)

      if (connectionError) {
        console.error('Supabase connection error:', connectionError)
        setConnectionStatus(`❌ Connection Error: ${connectionError.message}`)
        setError(connectionError.message)
      } else {
        console.log('Supabase connection successful:', data)
        setConnectionStatus('✅ Connection Successful')
        setArtists(data || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setConnectionStatus(`❌ Unexpected Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addTestArtist = async () => {
    try {
      const testArtist = {
        url: `test-artist-${Date.now()}`,
        name: `Test Artist ${new Date().toLocaleTimeString()}`,
        facebook: 'https://facebook.com/test'
      }

      const { data, error } = await supabase
        .from('artists')
        .insert([testArtist])
        .select()

      if (error) {
        setError(`Insert Error: ${error.message}`)
      } else {
        console.log('Artist inserted:', data)
        setArtists(prev => [...prev, ...data])
        setError(null)
      }
    } catch (err) {
      setError(`Insert Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Supabase Connection Test</h1>
          <p className="mt-2 text-sm text-gray-700">
            Testing database connectivity and basic operations.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={testSupabaseConnection}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Retry Connection
          </button>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-8">
        <div className={`rounded-md p-4 ${
          connectionStatus.includes('✅') 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                connectionStatus.includes('✅') ? 'text-green-800' : 'text-red-800'
              }`}>
                Connection Status: {connectionStatus}
              </h3>
              {error && (
                <div className="mt-2 text-sm text-red-700">
                  <p>Error Details: {error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test Operations */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Test Operations</h2>
        <div className="space-x-4">
          <button
            onClick={addTestArtist}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add Test Artist
          </button>
        </div>
      </div>

      {/* Artists Data */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Artists Data</h2>
        {artists.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {artists.map((artist) => (
                  <tr key={artist.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {artist.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {artist.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {artist.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {artist.created_at ? new Date(artist.created_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No artists found or connection failed</p>
          </div>
        )}
      </div>

      {/* Environment Debug */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Environment Debug</h2>
        <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono">
          <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
          <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          <p>Service Role Key: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}</p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}