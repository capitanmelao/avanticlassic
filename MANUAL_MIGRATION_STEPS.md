# Manual E-commerce Migration Steps

Since automated SQL execution is restricted, here are the manual steps to complete the e-commerce migration:

## Step 1: Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/cfyndmpjohwtvzljtypr/sql
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

## Step 2: Create E-commerce Tables

Copy and paste this SQL into the editor and click "Run":

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'cd',
  release_id UUID REFERENCES releases(id),
  stripe_product_id TEXT UNIQUE,
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  inventory_tracking BOOLEAN DEFAULT false,
  inventory_quantity INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_prices table
CREATE TABLE IF NOT EXISTS product_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  stripe_price_id TEXT UNIQUE,
  currency TEXT NOT NULL DEFAULT 'EUR',
  amount INTEGER NOT NULL,
  price_type TEXT NOT NULL DEFAULT 'one_time' CHECK (price_type IN ('one_time', 'recurring')),
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'EUR',
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customer_addresses table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('billing', 'shipping')),
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price_id UUID NOT NULL REFERENCES product_prices(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cart_items_customer_or_session CHECK (
    (customer_id IS NOT NULL AND session_id IS NULL) OR 
    (customer_id IS NULL AND session_id IS NOT NULL)
  )
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'partially_fulfilled', 'fulfilled')),
  subtotal_amount INTEGER NOT NULL DEFAULT 0,
  tax_amount INTEGER DEFAULT 0,
  shipping_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  billing_address JSONB,
  shipping_address JSONB,
  payment_method_types TEXT[] DEFAULT '{}',
  tracking_number TEXT,
  tracking_url TEXT,
  notes TEXT,
  adaptive_pricing_applied BOOLEAN DEFAULT false,
  tax_details JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  price_id UUID REFERENCES product_prices(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  product_name TEXT NOT NULL,
  product_format TEXT NOT NULL,
  product_images JSONB DEFAULT '[]'::jsonb,
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'fulfilled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create stripe_webhook_events table
CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'success', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES product_categories(id),
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product_category_relations table
CREATE TABLE IF NOT EXISTS product_category_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  minimum_order_amount INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create discount_usages table
CREATE TABLE IF NOT EXISTS discount_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID NOT NULL REFERENCES discount_codes(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  discount_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(discount_code_id, order_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_products_release_id ON products(release_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_active ON product_prices(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

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

-- Trigger to auto-generate order numbers
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

DROP TRIGGER IF EXISTS trigger_set_order_number ON orders;
CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Set updated_at timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all tables
DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_product_prices_updated_at ON product_prices;
CREATE TRIGGER trigger_product_prices_updated_at
    BEFORE UPDATE ON product_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_customers_updated_at ON customers;
CREATE TRIGGER trigger_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON orders;
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_cart_items_updated_at ON cart_items;
CREATE TRIGGER trigger_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

## Step 3: Insert Sample Data

After tables are created, run this to populate with data:

```sql
-- Insert product categories
INSERT INTO product_categories (name, description, sort_order, status) 
VALUES 
    ('Classical Music', 'Classical music releases and recordings', 1, 'active'),
    ('Featured Releases', 'Premium and featured classical music releases', 2, 'active'),
    ('Digital Downloads', 'Digital format classical music downloads', 3, 'active'),
    ('Physical Media', 'CD, SACD, and Vinyl classical music releases', 4, 'active')
ON CONFLICT (name) DO NOTHING;

-- Convert releases to products
INSERT INTO products (name, description, category, format, release_id, images, featured, status, inventory_tracking, inventory_quantity, sort_order, metadata)
SELECT 
    r.title,
    COALESCE(r.description, ''),
    'release',
    'cd',
    r.id,
    CASE 
        WHEN r.cover_image_url IS NOT NULL THEN jsonb_build_array(r.cover_image_url)
        ELSE '[]'::jsonb
    END,
    COALESCE(r.featured, false),
    'active',
    true,
    100,
    COALESCE(r.sort_order, 0),
    jsonb_build_object(
        'original_release_id', r.id,
        'release_date', r.release_date,
        'genre', COALESCE(r.genre, ''),
        'label', COALESCE(r.record_label, ''),
        'catalog_number', COALESCE(r.catalog_number, '')
    )
FROM releases r;

-- Create basic pricing for all products
INSERT INTO product_prices (product_id, currency, amount, price_type, active, metadata)
SELECT 
    p.id,
    'EUR',
    1990, -- €19.90
    'one_time',
    true,
    jsonb_build_object('format', 'cd', 'original_price', true)
FROM products p
WHERE p.category = 'release';

-- Create sample discount codes
INSERT INTO discount_codes (code, description, discount_type, discount_value, currency, usage_limit, expires_at, minimum_order_amount, status, metadata)
VALUES 
    ('LAUNCH20', 'Launch discount - 20% off first order', 'percentage', 20, 'EUR', 1000, NOW() + INTERVAL '30 days', 2000, 'active', '{"launch_promo": true}'),
    ('CLASSICAL10', 'Classical music lovers - 10% off', 'percentage', 10, 'EUR', NULL, NOW() + INTERVAL '365 days', 1500, 'active', '{"category": "classical"}'),
    ('VINYL5', 'Vinyl collectors - €5 off', 'fixed_amount', 500, 'EUR', 500, NOW() + INTERVAL '90 days', 3000, 'active', '{"format_specific": "vinyl"}')
ON CONFLICT (code) DO NOTHING;
```

## Step 4: Verify Migration

Run this query to check the results:

```sql
-- Check migration results
SELECT 
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM product_prices) as prices_count,
    (SELECT COUNT(*) FROM product_categories) as categories_count,
    (SELECT COUNT(*) FROM discount_codes) as discount_codes_count;

-- Show sample products
SELECT name, format, featured, status FROM products LIMIT 10;
```

## Expected Results

- **Products**: 37 products (one per release)
- **Prices**: 37 prices (one per product)  
- **Categories**: 4 categories
- **Discount Codes**: 3 sample codes

After completing these steps, the e-commerce foundation will be ready and Phase 2.1 will be complete!