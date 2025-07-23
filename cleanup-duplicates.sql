-- ===================================================================
-- CLEANUP DUPLICATE PRODUCTS SCRIPT
-- Removes duplicate products created by multiple migration runs
-- Keeps the most recent version of each product per release
-- Date: July 17, 2025
-- ===================================================================

-- ===================================================================
-- STEP 1: ANALYZE CURRENT STATE
-- ===================================================================

-- Show current duplicate situation
DO $$
DECLARE
    total_products integer;
    total_prices integer;
    unique_releases integer;
    expected_products integer;
    expected_prices integer;
BEGIN
    SELECT COUNT(*) INTO total_products FROM products;
    SELECT COUNT(*) INTO total_prices FROM product_prices;
    SELECT COUNT(DISTINCT release_id) INTO unique_releases FROM products;
    expected_products := unique_releases;
    expected_prices := unique_releases * 2; -- physical + digital
    
    RAISE NOTICE '=== CURRENT STATE ANALYSIS ===';
    RAISE NOTICE 'Total products found: %', total_products;
    RAISE NOTICE 'Total prices found: %', total_prices;
    RAISE NOTICE 'Unique releases: %', unique_releases;
    RAISE NOTICE 'Expected products: %', expected_products;
    RAISE NOTICE 'Expected prices: %', expected_prices;
    RAISE NOTICE 'Duplicates to remove: % products, % prices', 
        (total_products - expected_products), 
        (total_prices - expected_prices);
END $$;

-- ===================================================================
-- STEP 2: CREATE CLEANUP FUNCTIONS
-- ===================================================================

-- Function to identify and remove duplicate products
CREATE OR REPLACE FUNCTION cleanup_duplicate_products()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    duplicate_count integer;
    price_count integer;
    cleanup_record record;
BEGIN
    RAISE NOTICE 'Starting duplicate product cleanup...';
    
    -- Count duplicates before cleanup
    SELECT 
        COUNT(*) - COUNT(DISTINCT release_id) INTO duplicate_count
    FROM products;
    
    RAISE NOTICE 'Found % duplicate products to remove', duplicate_count;
    
    -- Remove duplicate products (keep the most recent one per release_id)
    -- This will cascade to product_prices due to foreign key constraints
    DELETE FROM products 
    WHERE id NOT IN (
        SELECT DISTINCT ON (release_id) id
        FROM products 
        ORDER BY release_id, created_at DESC
    );
    
    -- Get final counts
    SELECT COUNT(*) INTO duplicate_count FROM products;
    SELECT COUNT(*) INTO price_count FROM product_prices;
    
    RAISE NOTICE 'Cleanup completed:';
    RAISE NOTICE '- Products remaining: %', duplicate_count;
    RAISE NOTICE '- Prices remaining: %', price_count;
    RAISE NOTICE '- Expected: 1 product per release with 2 prices each';
END;
$$;

-- ===================================================================
-- STEP 3: ADD SAFEGUARDS TO PREVENT FUTURE DUPLICATES
-- ===================================================================

-- Add unique constraint to prevent duplicate products per release
ALTER TABLE products 
ADD CONSTRAINT unique_product_per_release 
UNIQUE (release_id);

-- Add unique constraint to prevent duplicate price types per product
ALTER TABLE product_prices 
ADD CONSTRAINT unique_variant_per_product 
UNIQUE (product_id, variant_type);

-- ===================================================================
-- STEP 4: CREATE MISSING TABLES
-- ===================================================================

-- Create missing discount_usages table (was referenced but not created)
CREATE TABLE IF NOT EXISTS public.discount_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  discount_amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_code_id, order_id)
);

-- ===================================================================
-- STEP 5: IMPROVE CONVERSION FUNCTION WITH SAFEGUARDS
-- ===================================================================

-- Updated conversion function with duplicate prevention
CREATE OR REPLACE FUNCTION convert_releases_to_products()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    release_record record;
    product_id UUID;
    physical_price_id UUID;
    digital_price_id UUID;
    physical_price INTEGER;
    digital_price INTEGER;
    product_format TEXT;
    disc_count INTEGER;
    bonus_dvd BOOLEAN;
    products_created INTEGER := 0;
    products_skipped INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting release-to-product conversion with duplicate protection...';
    
    FOR release_record IN 
        SELECT * FROM releases 
        ORDER BY release_date DESC
    LOOP
        -- Check if product already exists for this release
        IF EXISTS (SELECT 1 FROM products WHERE release_id = release_record.id) THEN
            products_skipped := products_skipped + 1;
            RAISE NOTICE 'Skipped release "%" - product already exists', release_record.title;
            CONTINUE;
        END IF;
        
        -- Determine format and pricing from Shopify URL
        product_format := get_format_from_url(COALESCE(release_record.shop_url, ''));
        disc_count := get_disc_count_from_url(COALESCE(release_record.shop_url, ''));
        bonus_dvd := has_bonus_dvd(COALESCE(release_record.shop_url, ''));
        physical_price := get_shopify_price(COALESCE(release_record.shop_url, ''), 1600);
        digital_price := physical_price - 600;

        -- Create product
        INSERT INTO products (
            name,
            description,
            format,
            disc_count,
            has_bonus_dvd,
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
            '',
            product_format,
            disc_count,
            bonus_dvd,
            release_record.id,
            CASE 
                WHEN release_record.image_url IS NOT NULL THEN ARRAY[release_record.image_url]
                ELSE '{}'
            END,
            COALESCE(release_record.featured, false),
            'active',
            true,
            100,
            COALESCE(release_record.sort_order, 0),
            jsonb_build_object(
                'original_release_id', release_record.id,
                'release_date', release_record.release_date,
                'catalog_number', COALESCE(release_record.catalog_number, ''),
                'shop_url', COALESCE(release_record.shop_url, ''),
                'spotify_url', COALESCE(release_record.spotify_url, ''),
                'apple_music_url', COALESCE(release_record.apple_music_url, ''),
                'youtube_music_url', COALESCE(release_record.youtube_music_url, ''),
                'amazon_music_url', COALESCE(release_record.amazon_music_url, ''),
                'bandcamp_url', COALESCE(release_record.bandcamp_url, ''),
                'soundcloud_url', COALESCE(release_record.soundcloud_url, ''),
                'original_format', product_format,
                'disc_count', disc_count,
                'has_bonus_dvd', bonus_dvd
            )
        ) RETURNING id INTO product_id;

        -- Create physical price
        INSERT INTO product_prices (
            product_id,
            variant_type,
            currency,
            amount,
            type,
            active,
            metadata
        ) VALUES (
            product_id,
            'physical',
            'EUR',
            physical_price,
            'one_time',
            true,
            jsonb_build_object(
                'format', product_format,
                'disc_count', disc_count,
                'has_bonus_dvd', bonus_dvd,
                'original_shopify_price', physical_price
            )
        ) RETURNING id INTO physical_price_id;

        -- Create digital price
        INSERT INTO product_prices (
            product_id,
            variant_type,
            currency,
            amount,
            type,
            active,
            metadata
        ) VALUES (
            product_id,
            'digital',
            'EUR',
            digital_price,
            'one_time',
            true,
            jsonb_build_object(
                'format', 'digital',
                'instant_download', true,
                'based_on_physical_price', physical_price
            )
        ) RETURNING id INTO digital_price_id;

        products_created := products_created + 1;
        
        RAISE NOTICE 'Created product for "%" (%) - Format: %, Physical: €%.%, Digital: €%.%', 
            release_record.title, 
            release_record.catalog_number,
            product_format,
            physical_price / 100,
            physical_price % 100,
            digital_price / 100,
            digital_price % 100;
    END LOOP;

    RAISE NOTICE 'Conversion completed:';
    RAISE NOTICE '- Products created: %', products_created;
    RAISE NOTICE '- Products skipped (already exist): %', products_skipped;
    RAISE NOTICE '- Total releases processed: %', (SELECT COUNT(*) FROM releases);
END;
$$;

-- ===================================================================
-- STEP 6: EXECUTE CLEANUP
-- ===================================================================

-- Run the cleanup
SELECT cleanup_duplicate_products();

-- ===================================================================
-- STEP 7: FINAL VERIFICATION
-- ===================================================================

-- Verify the cleanup results
DO $$
DECLARE
    product_count integer;
    price_count integer;
    physical_count integer;
    digital_count integer;
    sacd_count integer;
    cd_count integer;
    category_count integer;
    discount_count integer;
    release_count integer;
    unique_releases integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products;
    SELECT COUNT(*) INTO price_count FROM product_prices;
    SELECT COUNT(*) INTO physical_count FROM product_prices WHERE variant_type = 'physical';
    SELECT COUNT(*) INTO digital_count FROM product_prices WHERE variant_type = 'digital';
    SELECT COUNT(*) INTO sacd_count FROM products WHERE format LIKE '%sacd%';
    SELECT COUNT(*) INTO cd_count FROM products WHERE format = 'cd';
    SELECT COUNT(*) INTO category_count FROM product_categories;
    SELECT COUNT(*) INTO discount_count FROM discount_codes;
    SELECT COUNT(*) INTO release_count FROM releases;
    SELECT COUNT(DISTINCT release_id) INTO unique_releases FROM products;
    
    RAISE NOTICE '=== CLEANUP VERIFICATION COMPLETE ===';
    RAISE NOTICE 'Original releases: %', release_count;
    RAISE NOTICE 'Products: % (should equal %)', product_count, release_count;
    RAISE NOTICE 'Unique release mappings: %', unique_releases;
    RAISE NOTICE 'Total prices: % (% physical, % digital)', price_count, physical_count, digital_count;
    RAISE NOTICE 'Expected prices: % (2 per product)', product_count * 2;
    RAISE NOTICE 'Formats: % SACD/Hybrid SACD, % CD', sacd_count, cd_count;
    RAISE NOTICE 'Categories: %', category_count;
    RAISE NOTICE 'Discount codes: %', discount_count;
    
    IF product_count = release_count AND price_count = (product_count * 2) THEN
        RAISE NOTICE '✅ SUCCESS: Clean 1:1 mapping of releases to products!';
        RAISE NOTICE '✅ All duplicates removed, constraints added!';
        RAISE NOTICE '✅ Ready for production e-commerce use!';
    ELSE
        RAISE NOTICE '⚠️  WARNING: Counts do not match expected values';
    END IF;
END $$;

-- ===================================================================
-- STEP 8: SHOW SAMPLE DATA
-- ===================================================================

-- Show a few sample products to verify quality
DO $$
DECLARE
    sample_record record;
    sample_count integer := 0;
BEGIN
    RAISE NOTICE '=== SAMPLE PRODUCTS (First 5) ===';
    
    FOR sample_record IN 
        SELECT 
            p.name,
            p.format,
            p.disc_count,
            p.has_bonus_dvd,
            pp_physical.amount as physical_price,
            pp_digital.amount as digital_price,
            r.catalog_number
        FROM products p
        JOIN releases r ON p.release_id = r.id
        LEFT JOIN product_prices pp_physical ON p.id = pp_physical.product_id AND pp_physical.variant_type = 'physical'
        LEFT JOIN product_prices pp_digital ON p.id = pp_digital.product_id AND pp_digital.variant_type = 'digital'
        ORDER BY r.sort_order
        LIMIT 5
    LOOP
        sample_count := sample_count + 1;
        RAISE NOTICE '%. % (%) - Format: %, Discs: %, Physical: €%.%, Digital: €%.%',
            sample_count,
            sample_record.name,
            sample_record.catalog_number,
            sample_record.format,
            sample_record.disc_count,
            sample_record.physical_price / 100,
            sample_record.physical_price % 100,
            sample_record.digital_price / 100,
            sample_record.digital_price % 100;
    END LOOP;
END $$;

-- Cleanup completed successfully!