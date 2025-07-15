// Role-based permissions system
// Two-tier admin architecture implementation
// Updated: July 15, 2025 - Simple authentication

import React from 'react'
import { AuthUser } from './auth'

export type UserRole = 'company_admin' | 'super_admin'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: Record<string, unknown>
  created_by?: string
  last_login?: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

// Permission definitions for each role
export const PERMISSIONS = {
  company_admin: {
    // Content management permissions
    artists: { read: true, write: true, delete: true },
    releases: { read: true, write: true, delete: true },
    videos: { read: true, write: true, delete: true },
    playlists: { read: true, write: true, delete: true },
    reviews: { read: true, write: true, delete: true },
    distributors: { read: true, write: true, delete: true },
    
    // Restricted permissions
    settings: { read: false, write: false, delete: false },
    users: { read: false, write: false, delete: false },
    audit: { read: false, write: false, delete: false },
    system: { read: false, write: false, delete: false }
  },
  super_admin: {
    // Full access to everything
    artists: { read: true, write: true, delete: true },
    releases: { read: true, write: true, delete: true },
    videos: { read: true, write: true, delete: true },
    playlists: { read: true, write: true, delete: true },
    reviews: { read: true, write: true, delete: true },
    distributors: { read: true, write: true, delete: true },
    settings: { read: true, write: true, delete: true },
    users: { read: true, write: true, delete: true },
    audit: { read: true, write: true, delete: true },
    system: { read: true, write: true, delete: true }
  }
} as const

// Navigation items that should be hidden for company admins
export const RESTRICTED_ROUTES = [
  '/dashboard/settings',
  '/dashboard/users',
  '/dashboard/audit',
  '/dashboard/system'
]

// Check if user has permission for a specific action
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: 'read' | 'write' | 'delete'
): boolean {
  const rolePermissions = PERMISSIONS[userRole]
  const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions]
  
  if (!resourcePermissions || typeof resourcePermissions !== 'object') {
    return false
  }
  
  return resourcePermissions[action] === true
}

// Check if user can access a specific route
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Super admins can access everything
  if (userRole === 'super_admin') {
    return true
  }
  
  // Company admins cannot access restricted routes
  if (userRole === 'company_admin') {
    return !RESTRICTED_ROUTES.some(restrictedRoute => 
      route.startsWith(restrictedRoute)
    )
  }
  
  return false
}

// Get user's role and permissions from session
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const response = await fetch('/api/auth/me')
    if (response.ok) {
      const data = await response.json()
      return data.user
    }
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Check if current user is a super admin
export async function isSuperAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'super_admin'
}

// Check if current user is a company admin
export async function isCompanyAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'company_admin'
}

// Validate user permissions for an action
export async function validatePermission(
  resource: string,
  action: 'read' | 'write' | 'delete'
): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  return hasPermission(user.role as UserRole, resource, action)
}

// Get available navigation items for user role
export function getAvailableNavigation(userRole: UserRole) {
  const allNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'home' },
    { href: '/dashboard/artists', label: 'Artists', icon: 'users' },
    { href: '/dashboard/releases', label: 'Releases', icon: 'disc' },
    { href: '/dashboard/videos', label: 'Videos', icon: 'video' },
    { href: '/dashboard/playlists', label: 'Playlists', icon: 'music' },
    { href: '/dashboard/reviews', label: 'Reviews', icon: 'star' },
    { href: '/dashboard/distributors', label: 'Distributors', icon: 'globe' },
    { href: '/dashboard/settings', label: 'Settings', icon: 'settings', restricted: true },
    { href: '/dashboard/users', label: 'Users', icon: 'user-group', restricted: true },
  ]
  
  // Filter out restricted items for company admins
  if (userRole === 'company_admin') {
    return allNavItems.filter(item => !item.restricted)
  }
  
  return allNavItems
}

// Permission-based component wrapper
export function requirePermission(
  component: React.ComponentType<Record<string, unknown>>,
  resource: string,
  action: 'read' | 'write' | 'delete'
) {
  return function PermissionGuard(props: Record<string, unknown>) {
    const [hasAccess, setHasAccess] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    
    React.useEffect(() => {
      validatePermission(resource, action)
        .then(setHasAccess)
        .finally(() => setLoading(false))
    }, [])
    
    if (loading) {
      return React.createElement('div', { 
        className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-black' 
      })
    }
    
    if (!hasAccess) {
      return React.createElement('div', { className: 'text-center py-12' }, [
        React.createElement('div', { 
          key: 'icon',
          className: 'mx-auto h-12 w-12 text-gray-400' 
        }, [
          React.createElement('svg', {
            key: 'svg',
            fill: 'none',
            stroke: 'currentColor',
            viewBox: '0 0 24 24'
          }, [
            React.createElement('path', {
              key: 'path',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M12 15v2m0 0v2m0-2h2m-2 0H8m13-9a9 9 0 11-18 0 9 9 0 0118 0z'
            })
          ])
        ]),
        React.createElement('h3', { 
          key: 'title',
          className: 'mt-2 text-sm font-medium text-gray-900' 
        }, 'Access Denied'),
        React.createElement('p', { 
          key: 'message',
          className: 'mt-1 text-sm text-gray-500' 
        }, 'You don\'t have permission to access this resource.')
      ])
    }
    
    return React.createElement(component, props)
  }
}

// Permission hook for components
export function usePermissions() {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])
  
  return {
    user,
    loading,
    hasPermission: (resource: string, action: 'read' | 'write' | 'delete') => 
      user ? hasPermission(user.role as UserRole, resource, action) : false,
    canAccessRoute: (route: string) => 
      user ? canAccessRoute(user.role as UserRole, route) : false,
    isSuperAdmin: user?.role === 'super_admin',
    isCompanyAdmin: user?.role === 'company_admin'
  }
}

// Error types for permission system
export class PermissionError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'PermissionError'
  }
}

export class InsufficientPermissionError extends PermissionError {
  constructor(resource: string, action: string) {
    super(`Insufficient permission: ${action} on ${resource}`, 'INSUFFICIENT_PERMISSION')
  }
}

export class UnauthorizedError extends PermissionError {
  constructor() {
    super('Unauthorized access', 'UNAUTHORIZED')
  }
}