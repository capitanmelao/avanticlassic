import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeUtils } from '@/lib/stripe/server'

// Initialize default shipping rates for Avanti Classic
const DEFAULT_SHIPPING_RATES = [
  {
    display_name: 'Standard Shipping',
    type: 'fixed_amount' as const,
    fixed_amount: {
      amount: 599, // €5.99 in cents
      currency: 'eur',
    },
    delivery_estimate: {
      minimum: {
        unit: 'business_day' as const,
        value: 3,
      },
      maximum: {
        unit: 'business_day' as const,
        value: 7,
      },
    },
    metadata: {
      type: 'standard',
      region: 'eu',
    },
    tax_behavior: 'exclusive' as const,
  },
  {
    display_name: 'Express Shipping',
    type: 'fixed_amount' as const,
    fixed_amount: {
      amount: 1299, // €12.99 in cents
      currency: 'eur',
    },
    delivery_estimate: {
      minimum: {
        unit: 'business_day' as const,
        value: 1,
      },
      maximum: {
        unit: 'business_day' as const,
        value: 2,
      },
    },
    metadata: {
      type: 'express',
      region: 'eu',
    },
    tax_behavior: 'exclusive' as const,
  },
  {
    display_name: 'Free Shipping',
    type: 'fixed_amount' as const,
    fixed_amount: {
      amount: 0, // Free
      currency: 'eur',
    },
    delivery_estimate: {
      minimum: {
        unit: 'business_day' as const,
        value: 5,
      },
      maximum: {
        unit: 'business_day' as const,
        value: 10,
      },
    },
    metadata: {
      type: 'free',
      region: 'eu',
      minimum_amount: '2500', // Free shipping over €25
    },
    tax_behavior: 'exclusive' as const,
  },
  {
    display_name: 'International Shipping',
    type: 'fixed_amount' as const,
    fixed_amount: {
      amount: 1999, // €19.99 in cents
      currency: 'eur',
    },
    delivery_estimate: {
      minimum: {
        unit: 'business_day' as const,
        value: 7,
      },
      maximum: {
        unit: 'business_day' as const,
        value: 14,
      },
    },
    metadata: {
      type: 'international',
      region: 'worldwide',
    },
    tax_behavior: 'exclusive' as const,
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get('region') || 'eu'
    const orderAmount = parseInt(searchParams.get('order_amount') || '0')

    // Get existing shipping rates
    const existingRates = await stripeUtils.getShippingRates()
    
    // Filter rates based on region and order amount
    const availableRates = existingRates.filter(rate => {
      const rateRegion = rate.metadata?.region || 'eu'
      const rateType = rate.metadata?.type
      
      // Check region match
      if (region !== 'eu' && rateRegion !== 'worldwide' && rateRegion !== region) {
        return false
      }
      
      // Check if free shipping applies
      if (rateType === 'free') {
        const minimumAmount = parseInt(rate.metadata?.minimum_amount || '2500')
        return orderAmount >= minimumAmount
      }
      
      return true
    })

    return NextResponse.json({
      shipping_rates: availableRates.map(rate => ({
        id: rate.id,
        display_name: rate.display_name,
        fixed_amount: rate.fixed_amount,
        delivery_estimate: rate.delivery_estimate,
        metadata: rate.metadata,
      })),
    })

  } catch (error) {
    console.error('Get shipping rates error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'initialize') {
      // Check if shipping rates already exist
      const existingRates = await stripeUtils.getShippingRates()
      
      if (existingRates.length > 0) {
        return NextResponse.json({
          message: 'Shipping rates already initialized',
          existing_rates: existingRates.length,
        })
      }

      // Create default shipping rates
      const createdRates = []
      for (const rateData of DEFAULT_SHIPPING_RATES) {
        try {
          const rate = await stripeUtils.createShippingRate(rateData)
          createdRates.push(rate)
        } catch (error) {
          console.error(`Failed to create shipping rate: ${rateData.display_name}`, error)
        }
      }

      return NextResponse.json({
        message: 'Shipping rates initialized successfully',
        created_rates: createdRates.length,
        rates: createdRates.map(rate => ({
          id: rate.id,
          display_name: rate.display_name,
          fixed_amount: rate.fixed_amount,
        })),
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Initialize shipping rates error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}