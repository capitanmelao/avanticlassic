import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeUtils, isStripeConfigured } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/server-client'

// Sync products with Stripe
export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      )
    }
    const body = await request.json()
    const { productId, syncDirection = 'to_stripe' } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    if (syncDirection === 'to_stripe') {
      // Sync from our database to Stripe
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error || !product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      // Create or update Stripe product
      let stripeProduct
      if (product.stripe_product_id) {
        // Update existing
        stripeProduct = await stripeUtils.updateProduct(product.stripe_product_id, {
          name: product.name,
          description: product.description || undefined,
          images: product.images || [],
          metadata: {
            ...product.metadata,
            internal_id: product.id,
            category: product.category,
            format: product.format,
          },
        })
      } else {
        // Create new
        stripeProduct = await stripeUtils.createProduct({
          name: product.name,
          description: product.description || undefined,
          images: product.images || [],
          metadata: {
            ...product.metadata,
            internal_id: product.id,
            category: product.category,
            format: product.format,
          },
        })

        // Update our database with Stripe product ID
        await supabase
          .from('products')
          .update({ stripe_product_id: stripeProduct.id })
          .eq('id', productId)
      }

      return NextResponse.json({ 
        product: stripeProduct,
        message: 'Product synced to Stripe successfully'
      })
    } else {
      // Sync from Stripe to our database
      const { data: product } = await supabase
        .from('products')
        .select('stripe_product_id')
        .eq('id', productId)
        .single()

      if (!product?.stripe_product_id) {
        return NextResponse.json(
          { error: 'Product has no Stripe product ID' },
          { status: 400 }
        )
      }

      const stripeProduct = await stripe.products.retrieve(product.stripe_product_id)

      // Update our database with Stripe data
      const { data: updatedProduct, error: updateError } = await supabase
        .from('products')
        .update({
          name: stripeProduct.name,
          description: stripeProduct.description || '',
          images: stripeProduct.images || [],
          metadata: stripeProduct.metadata || {},
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating product from Stripe:', updateError)
        return NextResponse.json(
          { error: 'Failed to update product from Stripe' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        product: updatedProduct,
        message: 'Product synced from Stripe successfully'
      })
    }
  } catch (error) {
    console.error('Product sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync product' },
      { status: 500 }
    )
  }
}

// Get all Stripe products
export async function GET() {
  try {
    if (!isStripeConfigured) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      )
    }
    const stripeProducts = await stripe.products.list({
      limit: 100,
      active: true,
    })

    // Get our products for comparison
    const supabase = createAdminClient()
    const { data: ourProducts } = await supabase
      .from('products')
      .select('id, stripe_product_id, name')

    // Map Stripe products with our internal data
    const productsWithStatus = stripeProducts.data.map(stripeProduct => {
      const ourProduct = ourProducts?.find(p => p.stripe_product_id === stripeProduct.id)
      return {
        ...stripeProduct,
        internal_product: ourProduct || null,
        sync_status: ourProduct ? 'synced' : 'stripe_only',
      }
    })

    return NextResponse.json({
      products: productsWithStatus,
      has_more: stripeProducts.has_more,
    })
  } catch (error) {
    console.error('Error fetching Stripe products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Stripe products' },
      { status: 500 }
    )
  }
}