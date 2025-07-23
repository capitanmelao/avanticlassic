-- Migration: Create E-commerce Tables for Avanti Classic Shop
-- Phase 1: E-commerce Foundation Schema
-- Date: July 17, 2025

-- ===================================================================
-- CORE E-COMMERCE TABLES
-- ===================================================================

-- 1. Products Table (extends releases)
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  stripe_product_id TEXT UNIQUE NOT NULL,
  release_id INTEGER REFERENCES public.releases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('physical', 'digital')) NOT NULL DEFAULT 'physical',
  format TEXT CHECK (format IN ('cd', 'sacd', 'vinyl', 'digital_download')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive', 'archived')) DEFAULT 'active',
  images TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  tax_code TEXT, -- Stripe Tax product category
  inventory_quantity INTEGER DEFAULT 0,
  inventory_tracking BOOLEAN DEFAULT true,
  weight_grams INTEGER, -- for shipping calculations
  dimensions_cm JSONB, -- {"length": 12.5, "width": 12.5, "height": 1.0}
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Product Prices with Multi-Currency and Adaptive Pricing
CREATE TABLE IF NOT EXISTS public.product_prices (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  stripe_price_id TEXT UNIQUE NOT NULL,
  currency TEXT DEFAULT 'EUR' CHECK (length(currency) = 3),
  amount INTEGER NOT NULL, -- price in cents
  type TEXT CHECK (type IN ('one_time', 'recurring')) DEFAULT 'one_time',
  billing_period TEXT CHECK (billing_period IN ('day', 'week', 'month', 'year')),
  billing_interval INTEGER DEFAULT 1,
  adaptive_pricing_enabled BOOLEAN DEFAULT false,
  market_specific_pricing JSONB DEFAULT '{}', -- {"US": 1299, "GB": 999}
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Customers Table with AI Personalization Support
CREATE TABLE IF NOT EXISTS public.customers (
  id SERIAL PRIMARY KEY,
  stripe_customer_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  preferred_language TEXT CHECK (preferred_language IN ('en', 'fr', 'de')) DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'EUR',
  preferred_payment_methods TEXT[] DEFAULT '{}',
  checkout_personalization_data JSONB DEFAULT '{}', -- Stripe AI signals
  marketing_consent BOOLEAN DEFAULT false,
  marketing_consent_date TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT false,
  account_status TEXT CHECK (account_status IN ('active', 'suspended', 'deleted')) DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Addresses
CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES public.customers(id) ON DELETE CASCADE,
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
  country TEXT NOT NULL CHECK (length(country) = 2), -- ISO 3166-1 alpha-2
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Shopping Cart Items
CREATE TABLE IF NOT EXISTS public.cart_items (
  id SERIAL PRIMARY KEY,
  session_id TEXT, -- for guest checkout
  customer_id INTEGER REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  price_id INTEGER REFERENCES public.product_prices(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_amount INTEGER NOT NULL, -- price at time of adding to cart
  currency TEXT NOT NULL DEFAULT 'EUR',
  discounts JSONB DEFAULT '{}',
  personalization_data JSONB DEFAULT '{}', -- custom options, engraving, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_cart_item UNIQUE (COALESCE(session_id, ''), COALESCE(customer_id, 0), product_id, price_id)
);

-- 6. Orders Table with Enhanced Tracking
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- human-readable order number
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  customer_id INTEGER REFERENCES public.customers(id),
  customer_email TEXT NOT NULL, -- for guest orders
  status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')) DEFAULT 'pending',
  fulfillment_status TEXT CHECK (fulfillment_status IN ('unfulfilled', 'partial', 'fulfilled')) DEFAULT 'unfulfilled',
  
  -- Financial details
  subtotal_amount INTEGER NOT NULL, -- before tax and shipping
  tax_amount INTEGER DEFAULT 0,
  shipping_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'EUR',
  
  -- Addresses
  billing_address JSONB NOT NULL,
  shipping_address JSONB, -- can be null for digital orders
  
  -- Stripe specific
  payment_method_types TEXT[] DEFAULT '{}',
  adaptive_pricing_applied BOOLEAN DEFAULT false,
  tax_details JSONB DEFAULT '{}',
  
  -- Shipping and fulfillment
  shipping_method TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  notes TEXT, -- admin notes
  customer_notes TEXT, -- customer order notes
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES public.products(id),
  price_id INTEGER REFERENCES public.product_prices(id),
  quantity INTEGER NOT NULL,
  unit_amount INTEGER NOT NULL, -- price at time of order
  total_amount INTEGER NOT NULL, -- unit_amount * quantity
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  
  -- Product snapshot (in case product is deleted later)
  product_name TEXT NOT NULL,
  product_format TEXT NOT NULL,
  product_images TEXT[] DEFAULT '{}',
  
  -- Fulfillment
  fulfillment_status TEXT CHECK (fulfillment_status IN ('unfulfilled', 'fulfilled', 'returned')) DEFAULT 'unfulfilled',
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Stripe Webhook Events Tracking
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id SERIAL PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  processing_status TEXT CHECK (processing_status IN ('pending', 'success', 'failed', 'retrying')) DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  data JSONB NOT NULL,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Product Categories (for organization)
CREATE TABLE IF NOT EXISTS public.product_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES public.product_categories(id),
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Product Category Relations
CREATE TABLE IF NOT EXISTS public.product_category_relations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES public.product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- 11. Discount Codes and Promotions
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')) NOT NULL,
  value INTEGER NOT NULL, -- percentage (0-100) or amount in cents
  currency TEXT DEFAULT 'EUR',
  
  -- Usage limits
  usage_limit INTEGER, -- null = unlimited
  usage_count INTEGER DEFAULT 0,
  usage_limit_per_customer INTEGER DEFAULT 1,
  
  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  
  -- Conditions
  minimum_order_amount INTEGER DEFAULT 0,
  applicable_product_ids INTEGER[] DEFAULT '{}',
  applicable_category_ids INTEGER[] DEFAULT '{}',
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Discount Usage Tracking
CREATE TABLE IF NOT EXISTS public.discount_usages (
  id SERIAL PRIMARY KEY,
  discount_code_id INTEGER REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  order_id INTEGER REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id INTEGER REFERENCES public.customers(id),
  discount_amount INTEGER NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(discount_code_id, order_id)
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_release_id ON public.products(release_id);
CREATE INDEX IF NOT EXISTS idx_products_type_format ON public.products(type, format);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_stripe_id ON public.products(stripe_product_id);

-- Product prices indexes
CREATE INDEX IF NOT EXISTS idx_product_prices_product_id ON public.product_prices(product_id);
CREATE INDEX IF NOT EXISTS idx_product_prices_currency ON public.product_prices(currency);
CREATE INDEX IF NOT EXISTS idx_product_prices_active ON public.product_prices(active);
CREATE INDEX IF NOT EXISTS idx_product_prices_stripe_id ON public.product_prices(stripe_price_id);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_id ON public.customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(account_status);

-- Customer addresses indexes
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON public.customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_default ON public.customer_addresses(customer_id, is_default);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON public.cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON public.cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_intent ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Webhook events indexes
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON public.stripe_webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.stripe_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.stripe_webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON public.stripe_webhook_events(created_at DESC);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON public.product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_categories_parent ON public.product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_active ON public.product_categories(active, sort_order);

-- Discount codes indexes
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON public.discount_codes(active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_validity ON public.discount_codes(valid_from, valid_until);

-- ===================================================================
-- FUNCTIONS AND TRIGGERS
-- ===================================================================

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Get current year and month
  SELECT 'AC' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(COALESCE(MAX(SUBSTRING(order_number FROM 8)::INTEGER), 0) + 1, 4, '0')
  INTO new_number
  FROM public.orders
  WHERE order_number LIKE 'AC' || TO_CHAR(NOW(), 'YYMM') || '-%';
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update cart item total
CREATE OR REPLACE FUNCTION update_cart_item_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the cart item with current price information
  SELECT pp.amount INTO NEW.unit_amount
  FROM public.product_prices pp
  WHERE pp.id = NEW.price_id AND pp.active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate Stripe webhook idempotency
CREATE OR REPLACE FUNCTION ensure_webhook_idempotency()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this event was already processed
  IF EXISTS (SELECT 1 FROM public.stripe_webhook_events WHERE stripe_event_id = NEW.stripe_event_id) THEN
    -- Event already exists, skip insertion
    RETURN NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- Trigger to update cart item totals
CREATE TRIGGER update_cart_item_total_trigger
  BEFORE INSERT OR UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_item_total();

-- Trigger for webhook idempotency
CREATE TRIGGER ensure_webhook_idempotency_trigger
  BEFORE INSERT ON public.stripe_webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION ensure_webhook_idempotency();

-- Apply standard update triggers to new tables
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_prices_updated_at BEFORE UPDATE ON public.product_prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON public.customer_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discount_codes_updated_at BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================================================

-- Enable RLS on all e-commerce tables
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

-- Admin policies (for admin panel access)
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

CREATE POLICY "Admin full access to customer_addresses" ON public.customer_addresses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to cart_items" ON public.cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to orders" ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to order_items" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to stripe_webhook_events" ON public.stripe_webhook_events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to product_categories" ON public.product_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to product_category_relations" ON public.product_category_relations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to discount_codes" ON public.discount_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

CREATE POLICY "Admin full access to discount_usages" ON public.discount_usages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE email = auth.email())
  );

-- Public read policies (for main site)
CREATE POLICY "Public can read active products" ON public.products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can read active product_prices" ON public.product_prices
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read active product_categories" ON public.product_categories
  FOR SELECT USING (active = true);

CREATE POLICY "Public can read product_category_relations" ON public.product_category_relations
  FOR SELECT USING (true);

-- Customer policies (customers can access their own data)
CREATE POLICY "Customers can access own data" ON public.customers
  FOR ALL USING (auth.email() = email);

CREATE POLICY "Customers can access own addresses" ON public.customer_addresses
  FOR ALL USING (
    customer_id IN (SELECT id FROM public.customers WHERE email = auth.email())
  );

CREATE POLICY "Customers can access own cart" ON public.cart_items
  FOR ALL USING (
    customer_id IN (SELECT id FROM public.customers WHERE email = auth.email())
  );

CREATE POLICY "Customers can access own orders" ON public.orders
  FOR SELECT USING (customer_email = auth.email());

CREATE POLICY "Customers can access own order_items" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE customer_email = auth.email())
  );

-- Anonymous cart access (for guest checkout)
CREATE POLICY "Anonymous cart access" ON public.cart_items
  FOR ALL USING (session_id IS NOT NULL AND customer_id IS NULL);

-- ===================================================================
-- INITIAL DATA
-- ===================================================================

-- Insert default product categories
INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
  ('Classical Music', 'classical-music', 'Traditional classical music recordings', 1),
  ('Contemporary Classical', 'contemporary-classical', 'Modern classical compositions', 2),
  ('Chamber Music', 'chamber-music', 'Small ensemble recordings', 3),
  ('Orchestral', 'orchestral', 'Full orchestra recordings', 4),
  ('Solo Performances', 'solo-performances', 'Solo artist recordings', 5),
  ('Digital Downloads', 'digital-downloads', 'Digital music downloads', 6)
ON CONFLICT (slug) DO NOTHING;

-- ===================================================================
-- COMMENTS FOR DOCUMENTATION
-- ===================================================================

COMMENT ON TABLE public.products IS 'Product catalog linking to releases with Stripe integration';
COMMENT ON TABLE public.product_prices IS 'Multi-currency pricing with Stripe adaptive pricing support';
COMMENT ON TABLE public.customers IS 'Customer accounts with AI personalization data';
COMMENT ON TABLE public.customer_addresses IS 'Customer shipping and billing addresses';
COMMENT ON TABLE public.cart_items IS 'Shopping cart with guest and authenticated user support';
COMMENT ON TABLE public.orders IS 'Order management with comprehensive tracking';
COMMENT ON TABLE public.order_items IS 'Individual items within orders';
COMMENT ON TABLE public.stripe_webhook_events IS 'Stripe webhook event tracking and processing';
COMMENT ON TABLE public.product_categories IS 'Product categorization system';
COMMENT ON TABLE public.discount_codes IS 'Promotional codes and discounts';

-- ===================================================================
-- COMPLETION MESSAGE
-- ===================================================================

-- This migration creates a comprehensive e-commerce foundation for Avanti Classic
-- Next steps:
-- 1. Set up Stripe API integration
-- 2. Create API routes for cart and checkout
-- 3. Implement product-release conversion utilities
-- 4. Build admin interface for shop management