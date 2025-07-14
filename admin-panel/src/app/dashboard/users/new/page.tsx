'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { usePermissions } from '@/lib/permissions'
import { logAuditEvent } from '@/lib/audit'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function NewUserPage() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'company_admin' as 'company_admin' | 'super_admin',
    status: 'active' as 'active' | 'inactive'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { isSuperAdmin } = usePermissions()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.email || !formData.name) {
        throw new Error('Email and name are required')
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Create new user
      const { data: newUser, error } = await supabase
        .from('admin_users')
        .insert([{
          email: formData.email,
          name: formData.name,
          role: formData.role,
          status: formData.status,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          permissions: formData.role === 'super_admin' ? { all: true } : {}
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      // Log the action
      await logAuditEvent({
        action: 'CREATE_USER',
        table_name: 'admin_users',
        record_id: newUser.id,
        new_data: {
          email: formData.email,
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
      console.error('Error creating user:', err)
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
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
          You don&apos;t have permission to create users.
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">User Created Successfully</h3>
        <p className="mt-1 text-sm text-gray-500">
          The user has been created and will be redirected to sign in.
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
          <h1 className="text-2xl font-semibold text-gray-900">Add New User</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create a new admin user account
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="user@example.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              The user will receive an invitation to sign in with this email.
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
              placeholder="John Doe"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="company_admin">Company Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="mt-2 text-sm text-gray-500">
              <p><strong>Company Admin:</strong> Can manage content (artists, releases, videos, etc.) but cannot access system settings or user management.</p>
              <p><strong>Super Admin:</strong> Full access to all features including system settings and user management.</p>
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Active users can sign in and use the system. Inactive users cannot sign in.
            </p>
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
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </button>
        </div>
      </form>

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Note</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>After creating a user, they will need to sign in through the Google OAuth system. Make sure the email address you enter is associated with a Google account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}