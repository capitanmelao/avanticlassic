import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const result = await login(email, password)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ 
      success: true,
      user: result.user 
    })

    // Set session cookie
    if (result.sessionToken) {
      response.cookies.set('session-token', result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      })
    }

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}