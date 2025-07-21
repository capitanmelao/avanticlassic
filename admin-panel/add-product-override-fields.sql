-- Add tax and shipping override fields to products table
-- This allows individual products to override default tax and shipping calculations

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tax_override_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tax_override_rate DECIMAL(5,4) DEFAULT NULL, -- e.g., 0.21 for 21%, 0.00 for 0%
ADD COLUMN IF NOT EXISTS tax_override_amount INTEGER DEFAULT NULL, -- fixed amount in cents instead of percentage

ADD COLUMN IF NOT EXISTS shipping_override_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS shipping_override_amount INTEGER DEFAULT NULL, -- shipping amount in cents, null = use default

ADD COLUMN IF NOT EXISTS shipping_free_threshold INTEGER DEFAULT NULL; -- override free shipping threshold per product

-- Add comments for clarity
COMMENT ON COLUMN public.products.tax_override_enabled IS 'When true, use product-specific tax settings instead of global defaults';
COMMENT ON COLUMN public.products.tax_override_rate IS 'Tax rate override (0.00-1.00), null uses global rate';
COMMENT ON COLUMN public.products.tax_override_amount IS 'Fixed tax amount in cents, overrides rate if set';
COMMENT ON COLUMN public.products.shipping_override_enabled IS 'When true, use product-specific shipping settings';
COMMENT ON COLUMN public.products.shipping_override_amount IS 'Shipping cost in cents, null uses global settings';
COMMENT ON COLUMN public.products.shipping_free_threshold IS 'Amount in cents for free shipping, null uses global threshold';

-- Create an index for products with overrides (for performance)
CREATE INDEX IF NOT EXISTS idx_products_tax_override ON public.products(tax_override_enabled) WHERE tax_override_enabled = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_shipping_override ON public.products(shipping_override_enabled) WHERE shipping_override_enabled = TRUE;