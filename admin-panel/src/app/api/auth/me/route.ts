import { NextRequest, NextResponse } from 'next/server'
import { parseSessionToken } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin-session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const sessionData = parseSessionToken(sessionToken)

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user: sessionData.user })

  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}