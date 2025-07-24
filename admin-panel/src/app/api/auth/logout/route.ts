import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (sessionToken) {
      await logout(sessionToken)
    }

    const response = NextResponse.json({ success: true })
    
    // Clear session cookie
    response.cookies.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}