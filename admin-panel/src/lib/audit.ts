// Audit logging system
// Track all administrative actions for security compliance
// Created: July 14, 2025

import { createClient } from './supabase'

export interface AuditLogEntry {
  id: string
  user_id: string
  action: string
  table_name: string
  record_id?: string
  old_data?: Record<string, any>
  new_data?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface AuditLogCreateData {
  action: string
  table_name: string
  record_id?: string
  old_data?: Record<string, any>
  new_data?: Record<string, any>
}

// Audit action types
export const AUDIT_ACTIONS = {
  // Content management actions
  CREATE_ARTIST: 'CREATE_ARTIST',
  UPDATE_ARTIST: 'UPDATE_ARTIST',
  DELETE_ARTIST: 'DELETE_ARTIST',
  
  CREATE_RELEASE: 'CREATE_RELEASE',
  UPDATE_RELEASE: 'UPDATE_RELEASE',
  DELETE_RELEASE: 'DELETE_RELEASE',
  
  CREATE_VIDEO: 'CREATE_VIDEO',
  UPDATE_VIDEO: 'UPDATE_VIDEO',
  DELETE_VIDEO: 'DELETE_VIDEO',
  
  CREATE_PLAYLIST: 'CREATE_PLAYLIST',
  UPDATE_PLAYLIST: 'UPDATE_PLAYLIST',
  DELETE_PLAYLIST: 'DELETE_PLAYLIST',
  
  CREATE_REVIEW: 'CREATE_REVIEW',
  UPDATE_REVIEW: 'UPDATE_REVIEW',
  DELETE_REVIEW: 'DELETE_REVIEW',
  
  CREATE_DISTRIBUTOR: 'CREATE_DISTRIBUTOR',
  UPDATE_DISTRIBUTOR: 'UPDATE_DISTRIBUTOR',
  DELETE_DISTRIBUTOR: 'DELETE_DISTRIBUTOR',
  
  // System actions
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // User management actions
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  CHANGE_USER_ROLE: 'CHANGE_USER_ROLE',
  SUSPEND_USER: 'SUSPEND_USER',
  ACTIVATE_USER: 'ACTIVATE_USER',
  
  // Authentication actions
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  
  // Security actions
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  
  // Data export actions
  EXPORT_DATA: 'EXPORT_DATA',
  BACKUP_DATA: 'BACKUP_DATA'
} as const

export type AuditAction = keyof typeof AUDIT_ACTIONS

// Log an audit entry
export async function logAuditEvent(data: AuditLogCreateData): Promise<void> {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('Cannot log audit event: No authenticated user')
      return
    }
    
    const { error } = await supabase
      .from('admin_audit_log')
      .insert({
        user_id: user.id,
        action: data.action,
        table_name: data.table_name,
        record_id: data.record_id,
        old_data: data.old_data,
        new_data: data.new_data
      })
    
    if (error) {
      console.error('Error logging audit event:', error)
    }
  } catch (error) {
    console.error('Error logging audit event:', error)
  }
}

// Get audit logs (with pagination)
export async function getAuditLogs(
  page: number = 1,
  limit: number = 50,
  userId?: string,
  action?: string,
  tableName?: string
): Promise<{
  logs: AuditLogEntry[]
  total: number
  page: number
  limit: number
}> {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('admin_audit_log')
      .select(`
        *,
        admin_users!inner(name, email)
      `)
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (action) {
      query = query.eq('action', action)
    }
    if (tableName) {
      query = query.eq('table_name', tableName)
    }
    
    // Get total count
    const { count } = await query
    
    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)
    
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    return {
      logs: data || [],
      total: count || 0,
      page,
      limit
    }
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return {
      logs: [],
      total: 0,
      page,
      limit
    }
  }
}

// Get audit logs for a specific record
export async function getRecordAuditHistory(
  tableName: string,
  recordId: string
): Promise<AuditLogEntry[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('admin_audit_log')
      .select(`
        *,
        admin_users!inner(name, email)
      `)
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw error
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching record audit history:', error)
    return []
  }
}

// Get audit statistics
export async function getAuditStats(): Promise<{
  totalActions: number
  actionsByType: Record<string, number>
  activeUsers: number
  recentActivity: AuditLogEntry[]
}> {
  const supabase = createClient()
  
  try {
    // Get total actions count
    const { count: totalActions } = await supabase
      .from('admin_audit_log')
      .select('*', { count: 'exact', head: true })
    
    // Get actions by type
    const { data: actionCounts } = await supabase
      .from('admin_audit_log')
      .select('action')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    
    const actionsByType: Record<string, number> = {}
    actionCounts?.forEach(({ action }) => {
      actionsByType[action] = (actionsByType[action] || 0) + 1
    })
    
    // Get active users count (last 7 days)
    const { data: activeUsersData } = await supabase
      .from('admin_audit_log')
      .select('user_id')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    
    const uniqueUsers = new Set(activeUsersData?.map(item => item.user_id))
    const activeUsers = uniqueUsers.size
    
    // Get recent activity
    const { data: recentActivity } = await supabase
      .from('admin_audit_log')
      .select(`
        *,
        admin_users!inner(name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    return {
      totalActions: totalActions || 0,
      actionsByType,
      activeUsers,
      recentActivity: recentActivity || []
    }
  } catch (error) {
    console.error('Error fetching audit stats:', error)
    return {
      totalActions: 0,
      actionsByType: {},
      activeUsers: 0,
      recentActivity: []
    }
  }
}

// Audit logging wrapper for database operations
export function withAudit<T extends Record<string, any>>(
  operation: () => Promise<T>,
  auditData: AuditLogCreateData
): Promise<T> {
  return operation().then(async (result) => {
    await logAuditEvent({
      ...auditData,
      new_data: result
    })
    return result
  })
}

// Format audit log entry for display
export function formatAuditEntry(entry: AuditLogEntry): string {
  const actionMap: Record<string, string> = {
    CREATE_ARTIST: 'created artist',
    UPDATE_ARTIST: 'updated artist',
    DELETE_ARTIST: 'deleted artist',
    CREATE_RELEASE: 'created release',
    UPDATE_RELEASE: 'updated release',
    DELETE_RELEASE: 'deleted release',
    CREATE_VIDEO: 'created video',
    UPDATE_VIDEO: 'updated video',
    DELETE_VIDEO: 'deleted video',
    CREATE_PLAYLIST: 'created playlist',
    UPDATE_PLAYLIST: 'updated playlist',
    DELETE_PLAYLIST: 'deleted playlist',
    CREATE_REVIEW: 'created review',
    UPDATE_REVIEW: 'updated review',
    DELETE_REVIEW: 'deleted review',
    CREATE_DISTRIBUTOR: 'created distributor',
    UPDATE_DISTRIBUTOR: 'updated distributor',
    DELETE_DISTRIBUTOR: 'deleted distributor',
    UPDATE_SETTINGS: 'updated site settings',
    CREATE_USER: 'created user account',
    UPDATE_USER: 'updated user account',
    DELETE_USER: 'deleted user account',
    CHANGE_USER_ROLE: 'changed user role',
    SUSPEND_USER: 'suspended user',
    ACTIVATE_USER: 'activated user',
    LOGIN: 'logged in',
    LOGOUT: 'logged out',
    LOGIN_FAILED: 'failed login attempt',
    PERMISSION_DENIED: 'permission denied',
    UNAUTHORIZED_ACCESS: 'unauthorized access attempt',
    EXPORT_DATA: 'exported data',
    BACKUP_DATA: 'created backup'
  }
  
  const actionText = actionMap[entry.action] || entry.action.toLowerCase()
  const recordInfo = entry.record_id ? ` (ID: ${entry.record_id})` : ''
  
  return `${actionText}${recordInfo}`
}

// Get human-readable time difference
export function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now.getTime() - time.getTime()
  
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 60) {
    return 'just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else {
    return time.toLocaleDateString()
  }
}