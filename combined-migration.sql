-- Combined E-commerce Migration Script
-- Execute this in the Supabase SQL Editor
-- Date: July 17, 2025

-- First, let's check if the required columns exist in the releases table
DO $$
BEGIN
    -- Check if the column exists before using it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'releases' AND column_name = 'status') THEN
        ALTER TABLE releases ADD COLUMN status text DEFAULT 'published';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'releases' AND column_name = 'distributors') THEN
        ALTER TABLE releases ADD COLUMN distributors jsonb DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'releases' AND column_name = 'record_label') THEN
        ALTER TABLE releases ADD COLUMN record_label text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'releases' AND column_name = 'catalog_number') THEN
        ALTER TABLE releases ADD COLUMN catalog_number text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'releases' AND column_name = 'genre') THEN
        ALTER TABLE releases ADD COLUMN genre text;
    END IF;
END $$;

-- Now create the e-commerce tables
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  stripe_product_id TEXT UNIQUE,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'release',
  format TEXT NOT NULL DEFAULT 'cd',
  images JSONB DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active',
  inventory_tracking BOOLEAN DEFAULT true,
  inventory_quantity INTEGER DEFAULT 100,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_prices (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  stripe_price_id TEXT UNIQUE,
  currency TEXT DEFAULT 'EUR',
  amount INTEGER NOT NULL,
  price_type TEXT DEFAULT 'one_time',
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id INTEGER REFERENCES public.product_categories(id),
  sort_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_category_relations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES public.product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.discount_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,
  discount_value INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  usage_limit INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE,
  minimum_order_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_release_id ON public.products(release_id);
CREATE INDEX IF NOT EXISTS idx_products_category_status ON public.products(category, status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON public.product_prices(product_id);

-- Insert product categories
INSERT INTO public.product_categories (name, description, sort_order, status) 
VALUES 
    ('Classical Music', 'Classical music releases and recordings', 1, 'active'),
    ('Featured Releases', 'Premium and featured classical music releases', 2, 'active'),
    ('Digital Downloads', 'Digital format classical music downloads', 3, 'active'),
    ('Physical Media', 'CD, SACD, and Vinyl classical music releases', 4, 'active')
ON CONFLICT (name) DO NOTHING;

-- Function to convert releases to products
CREATE OR REPLACE FUNCTION convert_releases_to_products()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    release_record record;
    product_id integer;
    cd_price_id integer;
    sacd_price_id integer;
    vinyl_price_id integer;
    digital_price_id integer;
    product_count integer := 0;
    price_count integer := 0;
BEGIN
    -- Loop through all releases
    FOR release_record IN 
        SELECT * FROM releases 
        WHERE COALESCE(status, 'published') = 'published'
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
            'release',
            'cd',
            release_record.id,
            CASE 
                WHEN release_record.cover_image_url IS NOT NULL 
                THEN jsonb_build_array(release_record.cover_image_url)
                ELSE '[]'::jsonb
            END,
            COALESCE(release_record.featured, false),
            'active',
            true,
            100,
            COALESCE(release_record.sort_order, 0),
            jsonb_build_object(
                'original_release_id', release_record.id,
                'release_date', release_record.release_date,
                'genre', COALESCE(release_record.genre, ''),
                'label', COALESCE(release_record.record_label, ''),
                'catalog_number', COALESCE(release_record.catalog_number, ''),
                'distributors', COALESCE(release_record.distributors, '[]'::jsonb)
            )
        ) RETURNING id INTO product_id;
        
        product_count := product_count + 1;

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
        
        price_count := price_count + 1;

        -- Create additional format variants if this is a premium release
        IF COALESCE(release_record.featured, false) = true THEN
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
            
            price_count := price_count + 1;

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
            
            price_count := price_count + 1;
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
        
        price_count := price_count + 1;

    END LOOP;

    RETURN format('Successfully converted %s releases to products with %s prices', product_count, price_count);
END;
$$;

-- Execute the conversion
SELECT convert_releases_to_products();

-- Link products to categories
WITH category_mappings AS (
    SELECT 
        p.id as product_id,
        CASE 
            WHEN p.featured = true THEN (SELECT id FROM product_categories WHERE name = 'Featured Releases')
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

-- Create sample discount codes
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
        2000,
        'active',
        jsonb_build_object('launch_promo', true, 'first_time_buyers', true)
    ),
    (
        'CLASSICAL10',
        'Classical music lovers - 10% off',
        'percentage',
        10,
        'EUR',
        NULL,
        NOW() + INTERVAL '365 days',
        1500,
        'active',
        jsonb_build_object('category', 'classical', 'recurring', true)
    ),
    (
        'VINYL5',
        'Vinyl collectors - €5 off vinyl purchases',
        'fixed_amount',
        500,
        'EUR',
        500,
        NOW() + INTERVAL '90 days',
        3000,
        'active',
        jsonb_build_object('format_specific', 'vinyl', 'collector_discount', true)
    )
ON CONFLICT (code) DO NOTHING;

-- Final statistics
DO $$
DECLARE
    product_count integer;
    price_count integer;
    category_count integer;
    discount_count integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products WHERE category = 'release';
    SELECT COUNT(*) INTO price_count FROM product_prices;
    SELECT COUNT(*) INTO category_count FROM product_categories;
    SELECT COUNT(*) INTO discount_count FROM discount_codes;
    
    RAISE NOTICE '=== MIGRATION COMPLETED ===';
    RAISE NOTICE 'Products created: %', product_count;
    RAISE NOTICE 'Prices created: %', price_count;
    RAISE NOTICE 'Categories available: %', category_count;
    RAISE NOTICE 'Discount codes created: %', discount_count;
    RAISE NOTICE 'Ready for e-commerce integration!';
END $$;