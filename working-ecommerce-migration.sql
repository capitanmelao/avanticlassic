-- ===================================================================
-- WORKING E-COMMERCE MIGRATION FOR AVANTI CLASSIC
-- Clean migration for production database (no existing e-commerce tables)
-- Date: July 17, 2025
-- ===================================================================

-- ===================================================================
-- STEP 1: CREATE REQUIRED FUNCTIONS FIRST
-- ===================================================================

-- Create the update_updated_at_column function (required by triggers)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- STEP 2: CREATE E-COMMERCE TABLES (UUID SCHEMA)
-- ===================================================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_product_id TEXT UNIQUE,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT CHECK (type IN ('physical', 'digital')) NOT NULL DEFAULT 'physical',
  format TEXT CHECK (format IN ('cd', 'sacd', 'vinyl', 'digital_download')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
  images TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  inventory_quantity INTEGER DEFAULT 0,
  inventory_tracking BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Product Prices Table
CREATE TABLE IF NOT EXISTS public.product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  stripe_price_id TEXT UNIQUE,
  currency TEXT DEFAULT 'EUR' CHECK (length(currency) = 3),
  amount INTEGER NOT NULL,
  type TEXT CHECK (type IN ('one_time', 'recurring')) DEFAULT 'one_time',
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  preferred_language TEXT CHECK (preferred_language IN ('en', 'fr', 'de')) DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'EUR',
  marketing_consent BOOLEAN DEFAULT false,
  account_status TEXT CHECK (account_status IN ('active', 'suspended', 'deleted')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Addresses Table
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('billing', 'shipping', 'both')) DEFAULT 'both',
  is_default BOOLEAN DEFAULT false,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state_province TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL CHECK (length(country) = 2),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  price_id UUID REFERENCES public.product_prices(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT cart_customer_or_session CHECK (
    (customer_id IS NOT NULL AND session_id IS NULL) OR 
    (customer_id IS NULL AND session_id IS NOT NULL)
  )
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  customer_id UUID REFERENCES public.customers(id),
  customer_email TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')) DEFAULT 'pending',
  fulfillment_status TEXT CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled')) DEFAULT 'unfulfilled',
  subtotal_amount INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  shipping_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  billing_address JSONB NOT NULL,
  shipping_address JSONB,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  price_id UUID REFERENCES public.product_prices(id),
  quantity INTEGER NOT NULL,
  unit_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  product_format TEXT NOT NULL,
  product_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.product_categories(id),
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Product Category Relations Table
CREATE TABLE IF NOT EXISTS public.product_category_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- 10. Discount Codes Table
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  minimum_order_amount INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Discount Usage Table
CREATE TABLE IF NOT EXISTS public.discount_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  discount_amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_code_id, order_id)
);

-- 12. Stripe Webhook Events Table
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- STEP 3: CREATE INDEXES
-- ===================================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_release_id ON public.products(release_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_stripe_id ON public.products(stripe_product_id);

-- Product prices indexes
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON public.product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_active ON public.product_prices(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_product_prices_stripe_id ON public.product_prices(stripe_price_id);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_id ON public.customers(stripe_customer_id);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON public.cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON public.cart_items(session_id);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_checkout_session_id);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ===================================================================
-- STEP 4: CREATE FUNCTIONS
-- ===================================================================

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    new_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the current date in YYYYMMDD format
    new_number := 'AV' || TO_CHAR(NOW(), 'YYYYMMDD') || '-';
    
    -- Get the count of orders created today
    SELECT COUNT(*) + 1 INTO counter
    FROM orders 
    WHERE DATE(created_at) = DATE(NOW());
    
    -- Pad with zeros to make it 4 digits
    new_number := new_number || LPAD(counter::TEXT, 4, '0');
    
    RETURN new_number;
END;
$$;

-- Function to set order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$;

-- ===================================================================
-- STEP 5: CREATE TRIGGERS
-- ===================================================================

-- Order number trigger
CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Updated_at triggers
CREATE TRIGGER trigger_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_product_prices_updated_at BEFORE UPDATE ON public.product_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_customer_addresses_updated_at BEFORE UPDATE ON public.customer_addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cart_items_updated_at BEFORE UPDATE ON public.cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_product_categories_updated_at BEFORE UPDATE ON public.product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_discount_codes_updated_at BEFORE UPDATE ON public.discount_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- STEP 6: INSERT INITIAL DATA
-- ===================================================================

-- Insert product categories
INSERT INTO public.product_categories (name, description, sort_order, status) 
VALUES 
    ('Classical Music', 'Classical music releases and recordings', 1, 'active'),
    ('Featured Releases', 'Premium and featured classical music releases', 2, 'active'),
    ('Digital Downloads', 'Digital format classical music downloads', 3, 'active'),
    ('Physical Media', 'CD, SACD, and Vinyl classical music releases', 4, 'active')
ON CONFLICT (name) DO NOTHING;

-- Insert sample discount codes
INSERT INTO public.discount_codes (code, description, discount_type, discount_value, currency, usage_limit, expires_at, minimum_order_amount, status, metadata)
VALUES 
    ('LAUNCH20', 'Launch discount - 20% off first order', 'percentage', 20, 'EUR', 1000, NOW() + INTERVAL '30 days', 2000, 'active', '{"launch_promo": true}'),
    ('CLASSICAL10', 'Classical music lovers - 10% off', 'percentage', 10, 'EUR', NULL, NOW() + INTERVAL '365 days', 1500, 'active', '{"category": "classical"}'),
    ('VINYL5', 'Vinyl collectors - €5 off', 'fixed_amount', 500, 'EUR', 500, NOW() + INTERVAL '90 days', 3000, 'active', '{"format_specific": "vinyl"}')
ON CONFLICT (code) DO NOTHING;

-- ===================================================================
-- STEP 7: CONVERT RELEASES TO PRODUCTS
-- ===================================================================

-- Function to convert releases to products (CORRECTED)
CREATE OR REPLACE FUNCTION convert_releases_to_products()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    release_record record;
    product_id UUID;
    cd_price_id UUID;
    sacd_price_id UUID;
    vinyl_price_id UUID;
    digital_price_id UUID;
BEGIN
    -- Loop through all releases
    FOR release_record IN 
        SELECT * FROM releases 
        ORDER BY release_date DESC
    LOOP
        -- Create base product for this release
        INSERT INTO products (
            name,
            description,
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
            '', -- No description in releases table
            'cd',
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
                'soundcloud_url', COALESCE(release_record.soundcloud_url, '')
            )
        ) RETURNING id INTO product_id;

        -- Create CD price
        INSERT INTO product_prices (
            product_id,
            currency,
            amount,
            type,
            active,
            metadata
        ) VALUES (
            product_id,
            'EUR',
            1990, -- €19.90
            'one_time',
            true,
            jsonb_build_object('format', 'cd', 'original_format', 'cd')
        ) RETURNING id INTO cd_price_id;

        -- Create additional formats for featured releases
        IF release_record.featured = true THEN
            -- SACD variant
            INSERT INTO product_prices (
                product_id,
                currency,
                amount,
                type,
                active,
                metadata
            ) VALUES (
                product_id,
                'EUR',
                2990, -- €29.90
                'one_time',
                true,
                jsonb_build_object('format', 'sacd', 'premium_variant', true)
            ) RETURNING id INTO sacd_price_id;

            -- Vinyl variant
            INSERT INTO product_prices (
                product_id,
                currency,
                amount,
                type,
                active,
                metadata
            ) VALUES (
                product_id,
                'EUR',
                3490, -- €34.90
                'one_time',
                true,
                jsonb_build_object('format', 'vinyl', 'premium_variant', true)
            ) RETURNING id INTO vinyl_price_id;
        END IF;

        -- Digital variant
        INSERT INTO product_prices (
            product_id,
            currency,
            amount,
            type,
            active,
            metadata
        ) VALUES (
            product_id,
            'EUR',
            1490, -- €14.90
            'one_time',
            true,
            jsonb_build_object('format', 'digital', 'instant_download', true)
        ) RETURNING id INTO digital_price_id;

        RAISE NOTICE 'Converted release "%" (ID: %) to product (ID: %)', 
            release_record.title, release_record.id, product_id;
    END LOOP;

    RAISE NOTICE 'Successfully converted % releases to products', 
        (SELECT COUNT(*) FROM releases);
END;
$$;

-- Execute the conversion
SELECT convert_releases_to_products();

-- ===================================================================
-- STEP 8: ENABLE ROW LEVEL SECURITY
-- ===================================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_category_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_usages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can read active products" ON public.products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read active product_prices" ON public.product_prices
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read active product_categories" ON public.product_categories
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read product_category_relations" ON public.product_category_relations
  FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admin full access to products" ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to product_prices" ON public.product_prices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to customers" ON public.customers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

-- Anonymous cart access
CREATE POLICY "Anonymous cart access" ON public.cart_items
  FOR ALL USING (session_id IS NOT NULL AND customer_id IS NULL);

-- Customer policies
CREATE POLICY "Customers can access own data" ON public.customers
  FOR ALL USING (auth.email() = email);

CREATE POLICY "Customers can access own cart" ON public.cart_items
  FOR ALL USING (
    customer_id IN (SELECT id FROM public.customers WHERE email = auth.email())
  );

CREATE POLICY "Customers can access own orders" ON public.orders
  FOR SELECT USING (customer_email = auth.email());

-- ===================================================================
-- STEP 9: VERIFICATION
-- ===================================================================

-- Final statistics
DO $$
DECLARE
    product_count integer;
    price_count integer;
    category_count integer;
    discount_count integer;
    release_count integer;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products;
    SELECT COUNT(*) INTO price_count FROM product_prices;
    SELECT COUNT(*) INTO category_count FROM product_categories;
    SELECT COUNT(*) INTO discount_count FROM discount_codes;
    SELECT COUNT(*) INTO release_count FROM releases;
    
    RAISE NOTICE '=== E-COMMERCE MIGRATION COMPLETED SUCCESSFULLY ===';
    RAISE NOTICE 'Original releases: %', release_count;
    RAISE NOTICE 'Products created: %', product_count;
    RAISE NOTICE 'Prices created: %', price_count;
    RAISE NOTICE 'Categories available: %', category_count;
    RAISE NOTICE 'Discount codes: %', discount_count;
    RAISE NOTICE '✅ Ready for Stripe integration!';
END $$;

-- Migration completed successfully!