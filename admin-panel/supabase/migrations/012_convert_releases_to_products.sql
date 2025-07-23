-- Migration: Convert existing releases to products with variants
-- Created: 2025-07-17
-- Purpose: Transform release data into e-commerce products with format variants

-- Function to convert releases to products
CREATE OR REPLACE FUNCTION convert_releases_to_products()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    release_record record;
    product_id uuid;
    cd_price_id uuid;
    sacd_price_id uuid;
    vinyl_price_id uuid;
    digital_price_id uuid;
BEGIN
    -- Loop through all active releases
    FOR release_record IN 
        SELECT * FROM releases 
        WHERE status = 'published' 
        ORDER BY release_date DESC
    LOOP
        -- Create base product for this release
        INSERT INTO products (
            name,
            description,
            category,
            format,
            release_id,
            images,
            featured,
            status,
            inventory_tracking,
            inventory_quantity,
            sort_order,
            metadata
        ) VALUES (
            release_record.title,
            COALESCE(release_record.description, ''),
            'release', -- Category for all release-based products
            'cd', -- Default format (we'll create variants)
            release_record.id,
            COALESCE(release_record.cover_image_url, '{}')::jsonb,
            COALESCE(release_record.featured, false),
            'active',
            true, -- Enable inventory tracking
            100, -- Default inventory
            COALESCE(release_record.sort_order, 0),
            jsonb_build_object(
                'original_release_id', release_record.id,
                'release_date', release_record.release_date,
                'genre', COALESCE(release_record.genre, ''),
                'label', COALESCE(release_record.record_label, ''),
                'catalog_number', COALESCE(release_record.catalog_number, ''),
                'distributors', COALESCE(release_record.distributors, '[]')
            )
        ) RETURNING id INTO product_id;

        -- Create price for CD format (base price)
        INSERT INTO product_prices (
            product_id,
            currency,
            amount,
            price_type,
            active,
            metadata
        ) VALUES (
            product_id,
            'EUR',
            1990, -- €19.90 default CD price
            'one_time',
            true,
            jsonb_build_object('format', 'cd', 'original_format', 'cd')
        ) RETURNING id INTO cd_price_id;

        -- Create additional format variants if this is a premium release
        IF release_record.featured = true THEN
            -- SACD variant (+€10)
            INSERT INTO product_prices (
                product_id,
                currency,
                amount,
                price_type,
                active,
                metadata
            ) VALUES (
                product_id,
                'EUR',
                2990, -- €29.90 for SACD
                'one_time',
                true,
                jsonb_build_object('format', 'sacd', 'premium_variant', true)
            ) RETURNING id INTO sacd_price_id;

            -- Vinyl variant (+€15)
            INSERT INTO product_prices (
                product_id,
                currency,
                amount,
                price_type,
                active,
                metadata
            ) VALUES (
                product_id,
                'EUR',
                3490, -- €34.90 for Vinyl
                'one_time',
                true,
                jsonb_build_object('format', 'vinyl', 'premium_variant', true)
            ) RETURNING id INTO vinyl_price_id;
        END IF;

        -- Always create digital variant (-€5)
        INSERT INTO product_prices (
            product_id,
            currency,
            amount,
            price_type,
            active,
            metadata
        ) VALUES (
            product_id,
            'EUR',
            1490, -- €14.90 for Digital
            'one_time',
            true,
            jsonb_build_object('format', 'digital', 'instant_download', true)
        ) RETURNING id INTO digital_price_id;

        RAISE NOTICE 'Converted release "%" (ID: %) to product (ID: %)', 
            release_record.title, release_record.id, product_id;
    END LOOP;

    RAISE NOTICE 'Successfully converted % releases to products', 
        (SELECT COUNT(*) FROM releases WHERE status = 'published');
END;
$$;

-- Execute the conversion
SELECT convert_releases_to_products();

-- Update product categories
INSERT INTO product_categories (name, description, parent_id, sort_order, status) 
VALUES 
    ('Classical Music', 'Classical music releases and recordings', NULL, 1, 'active'),
    ('Featured Releases', 'Premium and featured classical music releases', NULL, 2, 'active'),
    ('Digital Downloads', 'Digital format classical music downloads', NULL, 3, 'active'),
    ('Physical Media', 'CD, SACD, and Vinyl classical music releases', NULL, 4, 'active')
ON CONFLICT (name) DO NOTHING;

-- Link products to categories
WITH category_mappings AS (
    SELECT 
        p.id as product_id,
        CASE 
            WHEN p.featured = true THEN (SELECT id FROM product_categories WHERE name = 'Featured Releases')
            WHEN p.metadata->>'format' = 'digital' THEN (SELECT id FROM product_categories WHERE name = 'Digital Downloads')
            ELSE (SELECT id FROM product_categories WHERE name = 'Physical Media')
        END as category_id
    FROM products p
    WHERE p.category = 'release'
)
INSERT INTO product_category_relations (product_id, category_id)
SELECT product_id, category_id 
FROM category_mappings 
WHERE category_id IS NOT NULL
ON CONFLICT (product_id, category_id) DO NOTHING;

-- Create sample discount codes for launch
INSERT INTO discount_codes (
    code,
    description,
    discount_type,
    discount_value,
    currency,
    usage_limit,
    expires_at,
    minimum_order_amount,
    status,
    metadata
) VALUES 
    (
        'LAUNCH20',
        'Launch discount - 20% off first order',
        'percentage',
        20,
        'EUR',
        1000,
        NOW() + INTERVAL '30 days',
        2000, -- €20 minimum
        'active',
        jsonb_build_object('launch_promo', true, 'first_time_buyers', true)
    ),
    (
        'CLASSICAL10',
        'Classical music lovers - 10% off',
        'percentage',
        10,
        'EUR',
        NULL, -- Unlimited usage
        NOW() + INTERVAL '365 days',
        1500, -- €15 minimum
        'active',
        jsonb_build_object('category', 'classical', 'recurring', true)
    ),
    (
        'VINYL5',
        'Vinyl collectors - €5 off vinyl purchases',
        'fixed_amount',
        500, -- €5 in cents
        'EUR',
        500,
        NOW() + INTERVAL '90 days',
        3000, -- €30 minimum for vinyl
        'active',
        jsonb_build_object('format_specific', 'vinyl', 'collector_discount', true)
    )
ON CONFLICT (code) DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_release_id ON products(release_id);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON products(category, status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_product_prices_product_format ON product_prices(product_id, (metadata->>'format'));

-- Grant permissions for admin panel access
GRANT SELECT, INSERT, UPDATE, DELETE ON products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_prices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON product_category_relations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON discount_codes TO authenticated;

-- Final statistics
DO $$
DECLARE
    product_count integer;
    price_count integer;
    category_count integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products WHERE category = 'release';
    SELECT COUNT(*) INTO price_count FROM product_prices;
    SELECT COUNT(*) INTO category_count FROM product_categories;
    
    RAISE NOTICE '=== MIGRATION COMPLETED ===';
    RAISE NOTICE 'Products created: %', product_count;
    RAISE NOTICE 'Prices created: %', price_count;
    RAISE NOTICE 'Categories available: %', category_count;
    RAISE NOTICE 'Ready for e-commerce integration!';
END $$;