// Simple replacement for useSession hook
import { useState, useEffect } from 'react'
import { AuthUser } from './auth'

interface SessionData {
  user: AuthUser | null
}

interface UseSessionReturn {
  data: SessionData | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

export function useSession(): UseSessionReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setStatus('authenticated')
        } else {
          setUser(null)
          setStatus('unauthenticated')
        }
      } catch (error) {
        setUser(null)
        setStatus('unauthenticated')
      }
    }

    checkAuth()
  }, [])

  return {
    data: user ? { user } : null,
    status
  }
}

// Simple signOut function
export async function signOut(options?: { callbackUrl?: string }) {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    if (options?.callbackUrl) {
      window.location.href = options.callbackUrl
    } else {
      window.location.href = '/auth/signin'
    }
  } catch (error) {
    // Force redirect even if logout fails
    window.location.href = '/auth/signin'
  }
}