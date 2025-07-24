-- Migration: Add Stripe Payment Links support to releases table
-- Date: 2025-01-24
-- Description: Simplify e-commerce by adding direct payment links to releases

-- Add price and stripe_payment_link fields to releases table
ALTER TABLE public.releases 
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS stripe_payment_link TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.releases.price IS 'Price in EUR for this release';
COMMENT ON COLUMN public.releases.stripe_payment_link IS 'Direct Stripe payment link URL for this release';

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_releases_price ON public.releases(price);
CREATE INDEX IF NOT EXISTS idx_releases_stripe_payment_link ON public.releases(stripe_payment_link) WHERE stripe_payment_link IS NOT NULL;

-- Update RLS policies if needed (releases table should already have proper policies)

-- Migration notes:
-- 1. This adds price directly to releases (simplifies the products table complexity)
-- 2. stripe_payment_link will contain the full Stripe Payment Link URL
-- 3. Admin will manually create payment links in Stripe dashboard and paste URLs
-- 4. This replaces the complex cart/checkout system with direct payment links