'use client'

import { useSession } from '@/lib/use-session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import LegacyImageDisplay from '@/components/LegacyImageDisplay'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  created_at?: string
  updated_at?: string
}

interface SortableItemProps {
  id: number
  release: Release
  onDelete: (id: number) => void
}

function SortableItem({ id, release, onDelete }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`bg-white ${isDragging ? 'shadow-lg ring-2 ring-blue-500' : ''}`}
    >
      <td className="px-2 py-4 whitespace-nowrap">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 relative">
            <LegacyImageDisplay
              src={release.image_url}
              alt={release.title}
              className="h-12 w-12 rounded-md object-cover border border-gray-200"
              fallbackClassName="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center border border-gray-300"
              showLegacyPath={false}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {release.title}
            </div>
            <div className="text-sm text-gray-500">
              {release.catalog_number} • Order: {release.sort_order}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {release.url}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {release.release_date ? new Date(release.release_date).toLocaleDateString() : '—'}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
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
      <td className="px-4 py-4 whitespace-nowrap text-left text-sm font-medium">
        <div className="flex space-x-2">
          <Link
            href={`/dashboard/releases/${release.id}/edit`}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(release.id)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function ReleasesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
        .order('sort_order', { ascending: false })

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

  const updateSortOrder = async (newReleases: Release[]) => {
    try {
      setSaving(true)
      
      // Update sort_order for each release based on its new position
      const updates = newReleases.map((release, index) => ({
        id: release.id,
        sort_order: newReleases.length - index // Higher number = first position
      }))

      // Update each release's sort_order
      for (const update of updates) {
        const { error } = await supabase
          .from('releases')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id)
        
        if (error) throw error
      }

      // Update local state with new sort orders
      const updatedReleases = newReleases.map((release, index) => ({
        ...release,
        sort_order: newReleases.length - index
      }))
      
      setReleases(updatedReleases)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
      // Revert to original order on error
      loadReleases()
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id && over) {
      const oldIndex = releases.findIndex((item) => item.id === Number(active.id))
      const newIndex = releases.findIndex((item) => item.id === Number(over.id))

      const newReleases = arrayMove(releases, oldIndex, newIndex)
      
      // Optimistically update UI
      setReleases(newReleases)
      
      // Update database
      await updateSortOrder(newReleases)
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
            Manage album releases, EPs, and single recordings. Drag rows to reorder the display.
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

      {saving && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="text-sm text-blue-800">Saving order changes...</div>
        </div>
      )}

      {/* Sortable Table */}
      <div className="mt-8">
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL Slug
                  </th>
                  <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Release Date
                  </th>
                  <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th scope="col" className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <SortableContext items={releases.map(r => r.id)} strategy={verticalListSortingStrategy}>
                  {releases.map((release) => (
                    <SortableItem
                      key={release.id}
                      id={release.id}
                      release={release}
                      onDelete={deleteRelease}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
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