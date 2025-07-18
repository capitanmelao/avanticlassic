-- ===================================================================
-- SIMPLE STEP-BY-STEP DUPLICATE CLEANUP
-- Remove duplicates first, then add constraints
-- Date: July 17, 2025
-- ===================================================================

-- ===================================================================
-- STEP 1: ANALYZE CURRENT DUPLICATES
-- ===================================================================

-- Show which releases have duplicates
SELECT 
    release_id,
    COUNT(*) as duplicate_count,
    string_agg(id::text, ', ') as product_ids
FROM products 
GROUP BY release_id 
HAVING COUNT(*) > 1
ORDER BY release_id;

-- ===================================================================
-- STEP 2: REMOVE DUPLICATES (KEEP MOST RECENT)
-- ===================================================================

-- Delete duplicate products (keep the most recent one per release_id)
-- This will also cascade delete the associated product_prices
DELETE FROM products 
WHERE id NOT IN (
    SELECT DISTINCT ON (release_id) id
    FROM products 
    ORDER BY release_id, created_at DESC
);

-- ===================================================================
-- STEP 3: VERIFY CLEANUP
-- ===================================================================

-- Check if duplicates are gone
DO $$
DECLARE
    duplicate_releases integer;
    total_products integer;
    total_prices integer;
    unique_releases integer;
BEGIN
    -- Count releases with duplicates
    SELECT COUNT(*) INTO duplicate_releases
    FROM (
        SELECT release_id
        FROM products 
        GROUP BY release_id 
        HAVING COUNT(*) > 1
    ) as dups;
    
    SELECT COUNT(*) INTO total_products FROM products;
    SELECT COUNT(*) INTO total_prices FROM product_prices;
    SELECT COUNT(DISTINCT release_id) INTO unique_releases FROM products;
    
    RAISE NOTICE '=== CLEANUP VERIFICATION ===';
    RAISE NOTICE 'Releases with duplicates: %', duplicate_releases;
    RAISE NOTICE 'Total products: %', total_products;
    RAISE NOTICE 'Unique releases: %', unique_releases;
    RAISE NOTICE 'Total prices: %', total_prices;
    
    IF duplicate_releases = 0 THEN
        RAISE NOTICE '✅ SUCCESS: All duplicates removed!';
    ELSE
        RAISE NOTICE '❌ ERROR: Still have % releases with duplicates', duplicate_releases;
    END IF;
END $$;

-- ===================================================================
-- STEP 4: ADD CONSTRAINTS (ONLY AFTER CLEANUP)
-- ===================================================================

-- Add unique constraint to prevent future duplicates
ALTER TABLE products 
ADD CONSTRAINT unique_product_per_release 
UNIQUE (release_id);

-- Add unique constraint for price variants
ALTER TABLE product_prices 
ADD CONSTRAINT unique_variant_per_product 
UNIQUE (product_id, variant_type);

-- ===================================================================
-- STEP 5: CREATE MISSING TABLE
-- ===================================================================

-- Create missing discount_usages table
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
-- STEP 6: FINAL STATISTICS
-- ===================================================================

DO $$
DECLARE
    product_count integer;
    price_count integer;
    physical_count integer;
    digital_count integer;
    release_count integer;
    category_count integer;
    discount_count integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products;
    SELECT COUNT(*) INTO price_count FROM product_prices;
    SELECT COUNT(*) INTO physical_count FROM product_prices WHERE variant_type = 'physical';
    SELECT COUNT(*) INTO digital_count FROM product_prices WHERE variant_type = 'digital';
    SELECT COUNT(*) INTO release_count FROM releases;
    SELECT COUNT(*) INTO category_count FROM product_categories;
    SELECT COUNT(*) INTO discount_count FROM discount_codes;
    
    RAISE NOTICE '=== FINAL MIGRATION RESULTS ===';
    RAISE NOTICE 'Original releases: %', release_count;
    RAISE NOTICE 'Products created: % (should equal %)', product_count, release_count;
    RAISE NOTICE 'Prices created: % (% physical + % digital)', price_count, physical_count, digital_count;
    RAISE NOTICE 'Categories: %', category_count;
    RAISE NOTICE 'Discount codes: %', discount_count;
    
    IF product_count = release_count AND price_count = (product_count * 2) THEN
        RAISE NOTICE '🎉 PERFECT: Clean 1:1 release-to-product mapping achieved!';
        RAISE NOTICE '✅ E-commerce migration completed successfully!';
        RAISE NOTICE '✅ Ready for Stripe integration and production use!';
    ELSE
        RAISE NOTICE '⚠️  Numbers don''t match - check for remaining issues';
    END IF;
END $$;

-- Show sample products to verify quality
SELECT 
    p.name,
    r.catalog_number,
    p.format,
    p.disc_count,
    pp_physical.amount / 100.0 as physical_price_eur,
    pp_digital.amount / 100.0 as digital_price_eur
FROM products p
JOIN releases r ON p.release_id = r.id
LEFT JOIN product_prices pp_physical ON p.id = pp_physical.product_id AND pp_physical.variant_type = 'physical'
LEFT JOIN product_prices pp_digital ON p.id = pp_digital.product_id AND pp_digital.variant_type = 'digital'
ORDER BY r.sort_order
LIMIT 10;