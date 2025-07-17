# PROJECT STRUCTURE - Avanti Classic Shop Module

**Document Version**: 1.0  
**Date**: July 17, 2025  
**Scope**: E-commerce Architecture and File Organization  
**Status**: Ready for Implementation  

## 🏗️ **CURRENT PROJECT ARCHITECTURE**

### **Repository Structure** (v1.0.0-pre-ecommerce):
```
avanticlassic/
├── admin-panel/                     # Admin CMS (separate Next.js app)
├── app/                            # Main site (Next.js 15 App Router)
├── components/                     # Shared UI components
├── contexts/                       # React context providers
├── documentation/                  # Project documentation
├── hooks/                         # Custom React hooks
├── lib/                           # Utility libraries
├── public/                        # Static assets
├── styles/                        # Global styles
├── supabase/                      # Database schema and migrations
└── [config files]                # Next.js, TypeScript, Tailwind configs
```

### **Current Main Site Structure** (`/app/`):
```
app/
├── about/                         # About page
├── api/                          # API routes
│   └── playlists/                # Playlist API
├── artists/                      # Artist pages
├── favicon.ico                   # Site icon
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
├── news-and-more/                # News section
├── page.tsx                      # Homepage
├── playlists/                    # Playlist pages
├── releases/                     # Release pages
└── videos/                       # Video pages
```

### **Current Admin Panel Structure** (`/admin-panel/`):
```
admin-panel/
├── src/
│   ├── app/
│   │   ├── api/                  # Admin API routes
│   │   ├── auth/                 # Authentication pages
│   │   ├── dashboard/            # Admin dashboard
│   │   │   ├── artists/          # Artist management
│   │   │   ├── distributors/     # Distributor management
│   │   │   ├── playlists/        # Playlist management
│   │   │   ├── releases/         # Release management
│   │   │   ├── reviews/          # Review management
│   │   │   ├── settings/         # Site settings
│   │   │   ├── users/            # User management
│   │   │   └── videos/           # Video management
│   │   ├── globals.css           # Admin styles
│   │   └── layout.tsx            # Admin layout
│   ├── components/               # Admin UI components
│   ├── hooks/                    # Admin-specific hooks
│   ├── lib/                      # Admin utilities
│   └── middleware.ts             # Authentication middleware
├── public/                       # Admin static assets
├── supabase/                     # Database migrations
└── [config files]               # Admin app configurations
```

## 🛒 **SHOP MODULE INTEGRATION PLAN**

### **Extended Main Site Structure** (Post-Implementation):
```
app/
├── [existing routes...]          # All current routes preserved
├── shop/                         # NEW: E-commerce section
│   ├── page.tsx                  # Shop homepage
│   ├── products/                 # Product catalog
│   │   ├── page.tsx              # Product listing page
│   │   ├── [slug]/               # Individual product pages
│   │   │   └── page.tsx          # Product detail page
│   │   └── category/             # Product categories
│   │       └── [slug]/page.tsx   # Category pages
│   ├── cart/                     # Shopping cart
│   │   ├── page.tsx              # Cart page
│   │   └── components/           # Cart-specific components
│   ├── checkout/                 # Checkout process
│   │   ├── page.tsx              # Checkout form
│   │   ├── success/page.tsx      # Order confirmation
│   │   └── cancel/page.tsx       # Checkout cancellation
│   └── account/                  # Customer accounts
│       ├── page.tsx              # Account dashboard
│       ├── orders/               # Order history
│       │   ├── page.tsx          # Order list
│       │   └── [id]/page.tsx     # Order details
│       ├── profile/page.tsx      # Profile management
│       └── preferences/page.tsx  # Customer preferences
├── api/                          # Extended API routes
│   ├── [existing routes...]     # All current APIs preserved
│   ├── stripe/                   # NEW: Stripe integration
│   │   ├── checkout-sessions/    # Checkout session creation
│   │   │   └── route.ts          # POST /api/stripe/checkout-sessions
│   │   ├── webhooks/             # Stripe webhook handling
│   │   │   └── route.ts          # POST /api/stripe/webhooks
│   │   ├── products/             # Product management
│   │   │   └── route.ts          # GET/POST /api/stripe/products
│   │   └── customers/            # Customer management
│   │       └── route.ts          # GET/POST /api/stripe/customers
│   ├── cart/                     # Shopping cart API
│   │   ├── route.ts              # GET/POST /api/cart
│   │   ├── add/route.ts          # POST /api/cart/add
│   │   ├── update/route.ts       # PUT /api/cart/update
│   │   ├── remove/route.ts       # DELETE /api/cart/remove
│   │   └── clear/route.ts        # DELETE /api/cart/clear
│   └── shop/                     # Public shop API
│       ├── products/             # Public product catalog
│       │   └── route.ts          # GET /api/shop/products
│       ├── search/               # Product search
│       │   └── route.ts          # GET /api/shop/search
│       └── categories/           # Product categories
│           └── route.ts          # GET /api/shop/categories
```

### **Extended Admin Panel Structure** (Post-Implementation):
```
admin-panel/src/app/dashboard/
├── [existing sections...]       # All current admin sections preserved
├── shop/                        # NEW: Shop management section
│   ├── page.tsx                 # Shop dashboard overview
│   ├── products/                # Product management
│   │   ├── page.tsx             # Product list
│   │   ├── new/page.tsx         # Create product
│   │   └── [id]/                # Product details
│   │       ├── page.tsx         # Product overview
│   │       └── edit/page.tsx    # Edit product
│   ├── orders/                  # Order management
│   │   ├── page.tsx             # Order list
│   │   ├── [id]/                # Order details
│   │   │   ├── page.tsx         # Order overview
│   │   │   ├── edit/page.tsx    # Edit order
│   │   │   └── fulfill/page.tsx # Fulfillment actions
│   │   └── analytics/page.tsx   # Order analytics
│   ├── customers/               # Customer management
│   │   ├── page.tsx             # Customer list
│   │   ├── [id]/                # Customer details
│   │   │   ├── page.tsx         # Customer overview
│   │   │   └── edit/page.tsx    # Edit customer
│   │   └── analytics/page.tsx   # Customer analytics
│   ├── inventory/               # Inventory management
│   │   ├── page.tsx             # Inventory overview
│   │   └── [id]/page.tsx        # Product inventory
│   ├── analytics/               # Sales analytics
│   │   ├── page.tsx             # Analytics dashboard
│   │   ├── sales/page.tsx       # Sales reports
│   │   └── products/page.tsx    # Product performance
│   └── settings/                # Shop settings
│       ├── page.tsx             # General shop settings
│       ├── payments/page.tsx    # Payment configuration
│       ├── shipping/page.tsx    # Shipping settings
│       └── taxes/page.tsx       # Tax configuration
```

## 🗂️ **COMPONENT ORGANIZATION**

### **Shared Components** (`/components/`):
```
components/
├── [existing components...]     # All current components preserved
├── shop/                        # NEW: Shop-specific components
│   ├── common/                  # Shared shop components
│   │   ├── ProductCard.tsx      # Product display card
│   │   ├── PriceDisplay.tsx     # Price formatting
│   │   ├── AddToCartButton.tsx  # Add to cart functionality
│   │   └── ProductImage.tsx     # Product image display
│   ├── cart/                    # Cart components
│   │   ├── CartIcon.tsx         # Header cart icon
│   │   ├── CartDrawer.tsx       # Quick cart drawer
│   │   ├── CartItem.tsx         # Cart item display
│   │   └── CartSummary.tsx      # Cart totals and summary
│   ├── checkout/                # Checkout components
│   │   ├── CheckoutForm.tsx     # Main checkout form
│   │   ├── PaymentMethods.tsx   # Payment method selection
│   │   ├── ShippingForm.tsx     # Shipping address form
│   │   └── OrderSummary.tsx     # Order confirmation summary
│   ├── catalog/                 # Product catalog components
│   │   ├── ProductGrid.tsx      # Product grid layout
│   │   ├── ProductFilters.tsx   # Filter sidebar
│   │   ├── SearchBar.tsx        # Product search
│   │   └── CategoryNavigation.tsx # Category navigation
│   └── account/                 # Customer account components
│       ├── OrderHistory.tsx     # Order history display
│       ├── ProfileForm.tsx      # Profile editing form
│       └── AddressBook.tsx      # Saved addresses
└── ui/                          # Extended UI components
    ├── [existing UI...]         # All current UI components
    ├── currency.tsx             # Currency formatting
    ├── quantity-selector.tsx    # Quantity input
    └── loading-spinner.tsx      # Loading states
```

### **Admin Panel Components** (`/admin-panel/src/components/`):
```
admin-panel/src/components/
├── [existing components...]     # All current admin components
├── shop/                        # NEW: Shop admin components
│   ├── ProductForm.tsx          # Product creation/editing
│   ├── OrderTable.tsx           # Order list display
│   ├── CustomerTable.tsx        # Customer list display
│   ├── InventoryManager.tsx     # Inventory management
│   ├── SalesChart.tsx           # Sales analytics charts
│   ├── OrderStatusBadge.tsx     # Order status display
│   └── FulfillmentActions.tsx   # Order fulfillment tools
└── forms/                       # Extended form components
    ├── PriceInput.tsx           # Price input with currency
    ├── ProductImageUpload.tsx   # Product image management
    └── VariantManager.tsx       # Product variant management
```

## 📊 **DATABASE INTEGRATION**

### **Supabase Schema Extensions**:
```sql
-- New e-commerce tables (to be added)
products                         -- Product catalog
product_prices                   -- Pricing with multi-currency
customers                        -- Customer accounts
cart_items                       -- Shopping cart persistence
orders                          -- Order management
order_items                     -- Order line items
stripe_webhook_events           -- Webhook event tracking
product_categories              -- Product categorization
inventory_items                 -- Inventory tracking
customer_addresses              -- Saved customer addresses
```

### **Database File Structure**:
```
supabase/
├── [existing files...]         # All current schema files preserved
├── migrations/                 # Database migrations
│   ├── [existing migrations...]
│   ├── 011_create_products.sql # Product tables
│   ├── 012_create_customers.sql # Customer tables
│   ├── 013_create_orders.sql   # Order tables
│   ├── 014_create_cart.sql     # Cart tables
│   └── 015_create_webhooks.sql # Webhook tracking
└── functions/                  # Database functions
    ├── handle_product_sync.sql # Stripe product sync
    ├── process_order.sql       # Order processing
    └── calculate_tax.sql       # Tax calculation
```

## 🎨 **STYLING & ASSETS**

### **Style Organization**:
```
styles/
├── globals.css                 # Global styles (extended)
├── shop/                       # NEW: Shop-specific styles
│   ├── components.css          # Shop component styles
│   ├── checkout.css            # Checkout flow styles
│   └── responsive.css          # Mobile-specific shop styles
└── admin/                      # Admin panel styles
    └── shop.css                # Admin shop section styles
```

### **Static Assets**:
```
public/
├── [existing assets...]        # All current assets preserved
├── shop/                       # NEW: Shop-specific assets
│   ├── icons/                  # Shop icons (cart, payment, etc.)
│   ├── placeholder-product.jpg # Default product image
│   └── payment-methods/        # Payment method logos
└── admin/                      # Admin-specific assets
    └── shop-icons/             # Admin shop icons
```

## 🔧 **CONFIGURATION FILES**

### **Environment Variables** (Extended):
```bash
# Existing environment variables preserved
# NEW: Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ADAPTIVE_PRICING_ENABLED=true
STRIPE_TAX_ENABLED=true
NEXT_PUBLIC_STRIPE_API_VERSION=2025-06-30

# NEW: Shop Configuration
NEXT_PUBLIC_SHOP_ENABLED=true
NEXT_PUBLIC_CURRENCY_DEFAULT=EUR
NEXT_PUBLIC_SHOP_NAME="Avanti Classic Shop"
```

### **TypeScript Types** (Extended):
```typescript
// lib/types/shop.ts - NEW shop type definitions
export interface Product { ... }
export interface Customer { ... }
export interface Order { ... }
export interface CartItem { ... }
export interface StripeWebhookEvent { ... }
```

## 🔄 **MIGRATION STRATEGY**

### **File Addition Strategy**:
1. **Phase 1**: Add new directories and files without modifying existing ones
2. **Phase 2**: Extend existing files with new imports and exports
3. **Phase 3**: Add new navigation and routing to existing components
4. **Phase 4**: Integrate shop features into existing user flows

### **Backward Compatibility**:
- **All existing routes preserved**: No changes to current URL structure
- **Existing components untouched**: Shop components are additive
- **Database extensions only**: No modifications to current tables
- **API additions**: New endpoints without changing existing ones

### **Rollback Considerations**:
- **Clean separation**: Shop features can be disabled independently
- **Database rollback**: New tables can be dropped safely
- **File removal**: New files can be removed without affecting existing functionality
- **Configuration rollback**: Shop-specific environment variables can be removed

---

**This project structure ensures clean integration of e-commerce functionality while preserving the stability and organization of the existing Avanti Classic codebase. The modular approach allows for safe implementation and easy rollback if needed.**

**Next Step**: Begin implementation following this structure with Phase 1 database schema additions.