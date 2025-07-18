'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/use-session'
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface MigrationStatus {
  totalReleases: number
  releasesWithProducts: number
  needsMigration: number
  migrationComplete: boolean
}

interface MigrationResult {
  success: boolean
  message: string
  converted: number
  errors: string[]
}

export default function MigrateReleasesPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: _session } = useSession()
  const [status, setStatus] = useState<MigrationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [migrating, setMigrating] = useState(false)
  const [result, setResult] = useState<MigrationResult | null>(null)

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/admin/migrate-releases')
      if (!response.ok) throw new Error('Failed to load status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Failed to load migration status:', error)
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async () => {
    setMigrating(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/admin/migrate-releases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await response.json()
      setResult(data)
      
      // Refresh status after migration
      await loadStatus()
    } catch (error) {
      setResult({
        success: false,
        message: 'Migration failed with error',
        converted: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setMigrating(false)
    }
  }

  useEffect(() => {
    loadStatus()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Release-to-Product Migration
          </h1>
          <p className="text-gray-600 mt-1">
            Convert existing releases to products with pricing
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Migration Status
            </h2>
            
            {status && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl font-bold text-blue-600">
                    {status.totalReleases}
                  </div>
                  <div className="text-sm text-gray-600">Total Releases</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl font-bold text-green-600">
                    {status.releasesWithProducts}
                  </div>
                  <div className="text-sm text-gray-600">Have Products</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-2xl font-bold text-orange-600">
                    {status.needsMigration}
                  </div>
                  <div className="text-sm text-gray-600">Need Migration</div>
                </div>
              </div>
            )}

            {status?.migrationComplete && (
              <div className="mt-4 flex items-center text-green-600">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">Migration Complete!</span>
              </div>
            )}
          </div>

          {/* Migration Controls */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                What this migration does:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Creates or updates products for all releases</li>
                <li>• Sets default pricing: CD (€14), SACD (€16), Vinyl (€25), Digital (€10)</li>
                <li>• Fixes format capitalization (CD instead of cd)</li>
                <li>• Cleans up duplicate price entries</li>
                <li>• Links products to releases via release_id</li>
                <li>• Safe to run multiple times</li>
              </ul>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={runMigration}
                disabled={migrating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {migrating ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    <span>Migrating...</span>
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Run Migration</span>
                  </>
                )}
              </button>

              <button
                onClick={loadStatus}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                Refresh Status
              </button>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className={`rounded-lg p-4 ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-2">
                {result.success ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                )}
                <h3 className={`font-medium ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  Migration Result
                </h3>
              </div>
              
              <p className={`text-sm ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </p>
              
              {result.converted > 0 && (
                <p className="text-sm text-green-800 mt-1">
                  Successfully converted {result.converted} releases to products.
                </p>
              )}
              
              {result.errors && result.errors.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-red-900 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index} className="text-xs">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}