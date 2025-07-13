import { NextRequest, NextResponse } from 'next/server'
import { supabase, getLanguageFromHeaders } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, privacyConsent } = body
    const lang = body.lang || getLanguageFromHeaders(request.headers)
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ 
        error: 'Invalid email address' 
      }, { status: 400 })
    }
    
    // Check privacy consent
    if (!privacyConsent) {
      return NextResponse.json({ 
        error: 'Privacy consent is required' 
      }, { status: 400 })
    }
    
    // Get IP address and user agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const userAgent = request.headers.get('user-agent') || ''
    
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email)
      .single()
    
    if (existingSubscriber) {
      // If unsubscribed, reactivate
      if (existingSubscriber.status === 'unsubscribed') {
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            status: 'active',
            privacy_consent: true,
            consent_date: new Date().toISOString(),
            language: lang,
            ip_address: ip,
            user_agent: userAgent,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSubscriber.id)
        
        if (updateError) {
          console.error('Error reactivating subscriber:', updateError)
          return NextResponse.json({ 
            error: 'Failed to update subscription' 
          }, { status: 500 })
        }
        
        return NextResponse.json({ 
          success: true,
          message: 'Subscription reactivated successfully' 
        })
      }
      
      // Already active
      return NextResponse.json({ 
        success: true,
        message: 'Already subscribed' 
      })
    }
    
    // Create new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email,
        status: 'active',
        privacy_consent: true,
        consent_date: new Date().toISOString(),
        language: lang,
        ip_address: ip,
        user_agent: userAgent
      })
    
    if (insertError) {
      console.error('Error creating subscriber:', insertError)
      
      // Handle duplicate email error
      if (insertError.code === '23505') {
        return NextResponse.json({ 
          success: true,
          message: 'Already subscribed' 
        })
      }
      
      return NextResponse.json({ 
        error: 'Failed to subscribe' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully subscribed to newsletter' 
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// Unsubscribe endpoint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    
    if (!token && !email) {
      return NextResponse.json({ 
        error: 'Invalid unsubscribe request' 
      }, { status: 400 })
    }
    
    // Find subscriber
    let query = supabase
      .from('newsletter_subscribers')
      .select('id')
    
    if (token) {
      query = query.eq('unsubscribe_token', token)
    } else if (email) {
      query = query.eq('email', email)
    }
    
    const { data: subscriber, error: findError } = await query.single()
    
    if (findError || !subscriber) {
      return NextResponse.json({ 
        error: 'Subscriber not found' 
      }, { status: 404 })
    }
    
    // Update status to unsubscribed
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'unsubscribed',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id)
    
    if (updateError) {
      console.error('Error unsubscribing:', updateError)
      return NextResponse.json({ 
        error: 'Failed to unsubscribe' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully unsubscribed from newsletter' 
    })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}