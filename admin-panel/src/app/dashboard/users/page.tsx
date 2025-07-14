'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { usePermissions } from '@/lib/permissions'
import { logAuditEvent } from '@/lib/audit'
import { PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'company_admin' | 'super_admin'
  status: 'active' | 'inactive' | 'suspended'
  last_login: string | null
  created_at: string
  created_by: string | null
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user: currentUser, isSuperAdmin } = usePermissions()
  const supabase = createClient()

  const fetchUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete the user "${userEmail}"?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', userId)

      if (error) {
        throw error
      }

      // Log the action
      await logAuditEvent({
        action: 'DELETE_USER',
        table_name: 'admin_users',
        record_id: userId,
        old_data: { email: userEmail }
      })

      // Refresh the users list
      fetchUsers()
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Failed to delete user')
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ status: newStatus })
        .eq('id', userId)

      if (error) {
        throw error
      }

      // Log the action
      await logAuditEvent({
        action: newStatus === 'active' ? 'ACTIVATE_USER' : 'SUSPEND_USER',
        table_name: 'admin_users',
        record_id: userId,
        old_data: { status: currentStatus },
        new_data: { status: newStatus }
      })

      // Refresh the users list
      fetchUsers()
    } catch (err) {
      console.error('Error updating user status:', err)
      setError('Failed to update user status')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800'
      case 'company_admin':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isSuperAdmin) {
    return (
      <div className="text-center py-12">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don&apos;t have permission to manage users.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage admin users and their roles
          </p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add User
        </Link>
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

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Admin Users ({users.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role.replace('_', ' ')}
                      </span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      Created: {formatDate(user.created_at)}
                      {user.last_login && ` • Last login: ${formatDate(user.last_login)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleUserStatus(user.id, user.status)}
                    className={`inline-flex items-center px-3 py-1 border shadow-sm text-sm leading-4 font-medium rounded-md ${
                      user.status === 'active'
                        ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100'
                        : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100'
                    }`}
                    disabled={user.id === currentUser?.id}
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id, user.email)}
                    className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                    disabled={user.id === currentUser?.id}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {users.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new admin user.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}