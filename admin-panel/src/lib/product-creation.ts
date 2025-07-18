import { supabase } from '@/lib/supabase'

export interface ProductCreationData {
  name: string
  description: string
  image_url?: string
  release_id: number
  format: string
  catalog_number?: string
}

export interface PriceVariant {
  amount: number // in cents
  currency: string
  variant_type: string
}

// Default pricing based on format
export const getDefaultPricing = (format: string): PriceVariant[] => {
  const formatPricing: Record<string, number> = {
    'CD': 1400, // €14.00
    'SACD': 1600, // €16.00
    'Vinyl': 2500, // €25.00
    'Digital': 1000, // €10.00
    'Cassette': 1200, // €12.00
  }

  const basePrice = formatPricing[format] || 1400
  
  return [
    {
      amount: basePrice,
      currency: 'EUR',
      variant_type: 'default'
    }
  ]
}

export const createOrUpdateProductFromRelease = async (
  releaseId: number,
  releaseData: {
    title: string
    format: string
    image_url?: string
    catalog_number?: string
    description?: string
  }
): Promise<{ success: boolean; productId?: number; error?: string }> => {
  try {
    // Check if product already exists for this release
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('release_id', releaseId)
      .single()

    // Get next sort order for new products
    let sortOrder = 1
    if (!existingProduct) {
      const { data: maxSortOrder } = await supabase
        .from('products')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
      
      sortOrder = maxSortOrder?.[0]?.sort_order ? maxSortOrder[0].sort_order + 1 : 1
    }

    // Prepare product data
    const productData = {
      name: releaseData.title,
      description: releaseData.description || `${releaseData.title} - ${releaseData.format}`,
      type: 'physical' as const,
      format: releaseData.format.toLowerCase(),
      status: 'active' as const,
      featured: false,
      inventory_quantity: 100, // Default stock
      inventory_tracking: true,
      sort_order: sortOrder,
      release_id: releaseId,
      images: releaseData.image_url ? [releaseData.image_url] : [],
      metadata: {
        catalog_number: releaseData.catalog_number,
        auto_created: true,
        created_from_release: true
      }
    }

    let productId: number

    if (existingProduct) {
      // Update existing product
      const { error: updateError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', existingProduct.id)

      if (updateError) {
        return { success: false, error: updateError.message }
      }
      
      productId = existingProduct.id
    } else {
      // Create new product
      const { data: newProduct, error: createError } = await supabase
        .from('products')
        .insert(productData)
        .select('id')
        .single()

      if (createError) {
        return { success: false, error: createError.message }
      }

      productId = newProduct.id
    }

    // Create or update price variants
    const priceVariants = getDefaultPricing(releaseData.format)
    
    // Delete existing prices for this product
    await supabase
      .from('product_prices')
      .delete()
      .eq('product_id', productId)

    // Insert new prices
    const priceData = priceVariants.map(variant => ({
      product_id: productId,
      amount: variant.amount,
      currency: variant.currency,
      variant_type: variant.variant_type,
      type: 'one_time' as const,
      active: true
    }))

    const { error: priceError } = await supabase
      .from('product_prices')
      .insert(priceData)

    if (priceError) {
      return { success: false, error: priceError.message }
    }

    return { success: true, productId }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create product' 
    }
  }
}

// Migration function to convert all existing releases to products
export const migrateReleasesToProducts = async (): Promise<{
  success: boolean
  converted: number
  errors: string[]
}> => {
  const errors: string[] = []
  let converted = 0

  try {
    // Get all releases without products
    const { data: releases, error: fetchError } = await supabase
      .from('releases')
      .select(`
        id, 
        title, 
        format, 
        image_url, 
        catalog_number,
        translations
      `)
      .order('id')

    if (fetchError) {
      return { success: false, converted: 0, errors: [fetchError.message] }
    }

    // Convert each release to product
    for (const release of releases || []) {
      const description = release.translations?.en?.description || 
                         `${release.title} - ${release.format} release`

      const result = await createOrUpdateProductFromRelease(release.id, {
        title: release.title,
        format: release.format,
        image_url: release.image_url,
        catalog_number: release.catalog_number,
        description
      })

      if (result.success) {
        converted++
      } else {
        errors.push(`Release ${release.id} (${release.title}): ${result.error}`)
      }
    }

    return { success: true, converted, errors }
  } catch (error) {
    return { 
      success: false, 
      converted, 
      errors: [...errors, error instanceof Error ? error.message : 'Migration failed'] 
    }
  }
}