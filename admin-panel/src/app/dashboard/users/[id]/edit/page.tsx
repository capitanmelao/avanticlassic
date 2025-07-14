'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { usePermissions } from '@/lib/permissions'
import { logAuditEvent } from '@/lib/audit'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'company_admin' | 'super_admin'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  last_login: string | null
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: 'company_admin' as 'company_admin' | 'super_admin',
    status: 'active' as 'active' | 'inactive' | 'suspended'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { user: currentUser, isSuperAdmin } = usePermissions()
  const router = useRouter()
  const supabase = createClient()

  // Unwrap params Promise
  const [userId, setUserId] = useState<string | null>(null)
  useEffect(() => {
    params.then(p => setUserId(p.id))
  }, [params])

  useEffect(() => {
    if (userId) {
      fetchUser()
    }
  }, [userId, fetchUser])

  const fetchUser = useCallback(async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        throw error
      }

      setUser(data)
      setFormData({
        name: data.name,
        role: data.role,
        status: data.status
      })
    } catch (err) {
      console.error('Error fetching user:', err)
      setError('Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }, [userId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (!user) {
        throw new Error('User not found')
      }

      // Validate form
      if (!formData.name) {
        throw new Error('Name is required')
      }

      // Prevent user from changing their own role
      if (user.id === currentUser?.id && formData.role !== user.role) {
        throw new Error('You cannot change your own role')
      }

      // Update user
      const { error } = await supabase
        .from('admin_users')
        .update({
          name: formData.name,
          role: formData.role,
          status: formData.status,
          permissions: formData.role === 'super_admin' ? { all: true } : {}
        })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      // Log the action
      await logAuditEvent({
        action: 'UPDATE_USER',
        table_name: 'admin_users',
        record_id: user.id,
        old_data: {
          name: user.name,
          role: user.role,
          status: user.status
        },
        new_data: {
          name: formData.name,
          role: formData.role,
          status: formData.status
        }
      })

      setSuccess(true)
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard/users')
      }, 2000)

    } catch (err) {
      console.error('Error updating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don&apos;t have permission to edit users.
        </p>
      </div>
    )
  }

  if (loading || !userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">User Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The user you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-green-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">User Updated Successfully</h3>
        <p className="mt-1 text-sm text-gray-500">
          The user has been updated successfully.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Link
          href="/dashboard/users"
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Users
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit User</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update user information and permissions
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <div className="flex items-center">
          <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500">
              Created: {new Date(user.created_at).toLocaleDateString()}
              {user.last_login && ` • Last login: ${new Date(user.last_login).toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">
              Email cannot be changed after account creation.
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled={user.id === currentUser?.id}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="company_admin">Company Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="mt-2 text-sm text-gray-500">
              <p><strong>Company Admin:</strong> Can manage content but cannot access system settings or user management.</p>
              <p><strong>Super Admin:</strong> Full access to all features including system settings and user management.</p>
              {user.id === currentUser?.id && (
                <p className="text-yellow-600 mt-1">You cannot change your own role.</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              disabled={user.id === currentUser?.id}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <div className="mt-1 text-sm text-gray-500">
              <p><strong>Active:</strong> User can sign in and use the system.</p>
              <p><strong>Inactive:</strong> User account is disabled.</p>
              <p><strong>Suspended:</strong> User account is temporarily suspended.</p>
              {user.id === currentUser?.id && (
                <p className="text-yellow-600 mt-1">You cannot change your own status.</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end space-x-3">
          <Link
            href="/dashboard/users"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}