import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface CartItem {
  productId: number
  quantity: number
  addedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json()

    if (!productId || quantity <= 0) {
      return NextResponse.json({ error: 'Invalid product ID or quantity' }, { status: 400 })
    }

    // Get current cart from cookies
    const cookieStore = cookies()
    const cartCookie = cookieStore.get('cart')
    let cart: CartItem[] = []

    if (cartCookie) {
      try {
        cart = JSON.parse(cartCookie.value)
      } catch (error) {
        console.error('Invalid cart cookie:', error)
        cart = []
      }
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.productId === productId)
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart[existingItemIndex].quantity += quantity
      cart[existingItemIndex].addedAt = new Date().toISOString()
    } else {
      // Add new item
      cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString()
      })
    }

    // Save cart to cookies (expires in 7 days)
    const response = NextResponse.json({ success: true, cartItems: cart.length })
    response.cookies.set('cart', JSON.stringify(cart), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}