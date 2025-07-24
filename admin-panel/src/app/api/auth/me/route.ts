import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(sessionToken)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}