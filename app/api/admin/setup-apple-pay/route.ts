import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json()
    
    if (!domains || !Array.isArray(domains)) {
      return NextResponse.json(
        { error: 'Domains array is required' },
        { status: 400 }
      )
    }

    const results = []

    // Create Apple Pay domains for each provided domain
    for (const domain of domains) {
      try {
        const applePayDomain = await stripe.applePayDomains.create({
          domain_name: domain,
        })
        results.push({
          domain,
          status: 'success',
          id: applePayDomain.id,
          livemode: applePayDomain.livemode
        })
      } catch (error) {
        results.push({
          domain,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: 'Apple Pay domain setup completed',
      results,
      success: results.filter(r => r.status === 'success').length,
      errors: results.filter(r => r.status === 'error').length
    })

  } catch (error) {
    console.error('Apple Pay setup error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // List existing Apple Pay domains
    const domains = await stripe.applePayDomains.list({
      limit: 10
    })

    return NextResponse.json({
      domains: domains.data.map(domain => ({
        id: domain.id,
        domain_name: domain.domain_name,
        livemode: domain.livemode,
        created: domain.created
      }))
    })

  } catch (error) {
    console.error('Get Apple Pay domains error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}