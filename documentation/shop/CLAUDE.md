# CLAUDE.md - Avanti Classic Shop Module

This file provides comprehensive guidance to Claude Code for implementing the **E-commerce Shop Module** in the Avanti Classic project.

## 🎯 **PROJECT CONTEXT & STATUS**

### **Current Milestone**: v1.0.0-pre-ecommerce (July 17, 2025)
- **Stable Foundation**: Complete CMS with admin panel and main site
- **Production URLs**: 
  - Main Site: https://avanticlassic.vercel.app
  - Admin Panel: https://avanticlassic-admin.vercel.app
- **Authentication**: leinso@gmail.com / Naviondo123.1 (Super Admin)
- **Database**: Supabase PostgreSQL with all content tables and migrations
- **Rollback Point**: `git reset --hard v1.0.0-pre-ecommerce`

### **Shop Implementation Goal**
Transform Avanti Classic from using external Shopify links to a fully integrated e-commerce system with:
- **Stripe Checkout 2025 API** - Latest features and optimizations
- **Product Management** - Convert releases to purchasable products
- **Shopping Cart & Checkout** - Modern, mobile-first experience
- **Order Management** - Complete fulfillment workflow
- **Customer Accounts** - Registration, orders, preferences

## 🚀 **STRIPE 2025 FEATURES INTEGRATION**

### **Latest API Version**: 2025-06-30.basil
Based on official Stripe documentation and 2025 product updates from Stripe Sessions:

#### **Enhanced Checkout Features**:
- **AI-Powered Personalization**: 100+ signals for checkout optimization
- **Adaptive Pricing**: Automatic localization for 150+ markets
- **Enhanced Payment Methods**: Support for 125+ global payment methods
- **Mobile Payment Element**: Enhanced mobile checkout experience
- **Global Tax Solution**: Automatic tax calculation and compliance
- **Real-time Payments**: Support for Pix, UPI, stablecoins

#### **Required Dependencies** (2025):
```json
{
  "dependencies": {
    "stripe": "^16.0.0",
    "@stripe/stripe-js": "^4.0.0",
    "@stripe/react-stripe-js": "^2.8.0",
    "next": "15.0.0"
  }
}
```

#### **Environment Variables**:
```bash
# Stripe 2025 Configuration
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ADAPTIVE_PRICING_ENABLED=true
STRIPE_TAX_ENABLED=true
NEXT_PUBLIC_STRIPE_API_VERSION=2025-06-30
```

## 📊 **DATABASE SCHEMA DESIGN**

### **Core E-commerce Tables** (Supabase PostgreSQL):

```sql
-- Products table (extends existing releases)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  stripe_product_id TEXT UNIQUE NOT NULL,
  release_id INTEGER REFERENCES releases(id),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('physical', 'digital')),
  format TEXT CHECK (format IN ('cd', 'sacd', 'vinyl', 'digital_download')),
  status TEXT DEFAULT 'active',
  images TEXT[],
  metadata JSONB,
  tax_code TEXT, -- for Stripe Tax
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product prices with 2025 Adaptive Pricing
CREATE TABLE product_prices (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  stripe_price_id TEXT UNIQUE NOT NULL,
  currency TEXT DEFAULT 'EUR',
  amount INTEGER NOT NULL, -- in cents
  type TEXT CHECK (type IN ('one_time', 'recurring')),
  adaptive_pricing_enabled BOOLEAN DEFAULT false,
  market_specific_pricing JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced customers with AI personalization
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  stripe_customer_id TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  preferred_payment_methods TEXT[],
  checkout_personalization_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Shopping cart
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  session_id TEXT, -- guest checkout
  customer_id INTEGER REFERENCES customers(id),
  product_id INTEGER REFERENCES products(id),
  price_id INTEGER REFERENCES product_prices(id),
  quantity INTEGER DEFAULT 1,
  discounts JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders with 2025 enhancements
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  customer_id INTEGER REFERENCES customers(id),
  status TEXT DEFAULT 'pending',
  total_amount INTEGER,
  currency TEXT DEFAULT 'EUR',
  shipping_address JSONB,
  billing_address JSONB,
  tax_details JSONB,
  payment_method_types TEXT[],
  adaptive_pricing_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  price_id INTEGER REFERENCES product_prices(id),
  quantity INTEGER,
  unit_amount INTEGER,
  total_amount INTEGER,
  tax_amount INTEGER,
  discount_amount INTEGER DEFAULT 0
);

-- Webhook events tracking
CREATE TABLE stripe_webhook_events (
  id SERIAL PRIMARY KEY,
  stripe_event_id TEXT UNIQUE,
  event_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT false,
  retry_count INTEGER DEFAULT 0,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🏗️ **TECHNICAL ARCHITECTURE**

### **Next.js 15 App Router Structure**:
```
/app/
├── shop/
│   ├── page.tsx                    # Shop homepage
│   ├── products/[slug]/           # Product pages
│   ├── cart/                      # Shopping cart
│   ├── checkout/                  # Checkout flow
│   └── account/                   # Customer accounts
├── api/
│   ├── stripe/
│   │   ├── checkout-sessions/     # Create checkout sessions
│   │   ├── webhooks/             # Handle Stripe webhooks
│   │   └── products/             # Product management
│   └── cart/                     # Cart operations
└── admin-panel/
    └── dashboard/shop/           # Admin e-commerce management
```

### **Key Integration Points**:
1. **Releases → Products**: Convert existing releases to purchasable products
2. **Artists → Merchandise**: Extend artist pages with product collections
3. **Admin Panel**: Add shop management sections
4. **Authentication**: Extend existing auth for customer accounts
5. **Multilingual**: Maintain EN/FR/DE support for product descriptions

## 🛠️ **DEVELOPMENT WORKFLOW**

### **Phase 1: Database Schema & API Foundation**
- Create e-commerce tables in Supabase
- Set up Stripe product and price management
- Implement basic API routes for products and cart

### **Phase 2: Admin Panel Extensions**
- Add shop management to admin dashboard
- Product creation and management interface
- Order management and fulfillment tools
- Customer management system

### **Phase 3: Customer-Facing Shop**
- Build shop homepage with product catalog
- Implement shopping cart functionality
- Create checkout flow with Stripe integration
- Add customer account system

### **Phase 4: Advanced Features**
- Implement AI-powered personalization
- Add adaptive pricing for international markets
- Set up automated tax calculation
- Create order fulfillment workflows

## 🔧 **IMPLEMENTATION COMMANDS**

### **Development Environment**:
```bash
# Main site development
npm run dev          # http://localhost:3001

# Admin panel development
cd admin-panel
npm run dev          # http://localhost:3000
```

### **Database Management**:
```bash
# Apply new e-commerce schema
node scripts/run-migrations.js

# Check database integrity
node scripts/check-integrity.js
```

### **Stripe Integration**:
```bash
# Test webhooks locally
stripe listen --forward-to localhost:3001/api/stripe/webhooks

# Create test products
stripe products create --name "Test Product"
```

## 📋 **QUALITY ASSURANCE**

### **Testing Requirements**:
- **Unit Tests**: All API routes and utility functions
- **Integration Tests**: Stripe webhook handling
- **E2E Tests**: Complete checkout flow
- **Mobile Testing**: Responsive design verification

### **Security Checklist**:
- ✅ Webhook signature verification
- ✅ Input validation and sanitization
- ✅ Secure session management
- ✅ Payment data protection
- ✅ Customer data privacy compliance

## 🌐 **DEPLOYMENT STRATEGY**

### **Production Deployments**:
- **Main Site**: Auto-deploy from main branch to Vercel
- **Admin Panel**: Auto-deploy from main branch to Vercel
- **Database**: Supabase production with backups
- **Stripe**: Production webhooks and API keys

### **Environment Configuration**:
- **Development**: Test mode with Stripe test keys
- **Production**: Live mode with production keys
- **Staging**: Optional staging environment for testing

## 🔄 **ROLLBACK PROCEDURES**

### **Safe Rollback Options**:
1. **Git Rollback**: `git reset --hard v1.0.0-pre-ecommerce`
2. **Database Rollback**: Restore from pre-shop schema
3. **Vercel Rollback**: Promote stable deployment
4. **Feature Flags**: Disable shop features without full rollback

## 📚 **DOCUMENTATION STRUCTURE**

### **Shop-Specific Documentation**:
- `CONTEXT_RECAP.md` - Current implementation status
- `implementation-plan.md` - Detailed roadmap and milestones
- `bug-tracking.md` - Known issues and resolution status
- `project-structure.md` - File organization and architecture
- `frontend.spec.md` - UI/UX guidelines and design patterns

### **Integration Documentation**:
- Stripe 2025 API integration guide
- Database schema migration procedures
- Admin panel extension instructions
- Customer-facing shop development guide

## 🎯 **SUCCESS METRICS**

### **Technical Milestones**:
- ✅ Database schema implementation
- ✅ Admin panel integration
- ✅ Stripe checkout functionality
- ✅ Order management system
- ✅ Customer account system

### **Business Objectives**:
- Replace Shopify dependency with integrated solution
- Improve conversion rates with AI-powered checkout
- Expand to international markets with adaptive pricing
- Streamline order fulfillment process
- Enhance customer experience with personalization

## ⚠️ **CRITICAL REMINDERS**

### **Before Starting Development**:
1. **Verify Stable State**: Ensure v1.0.0-pre-ecommerce milestone is working
2. **Backup Database**: Create schema backup before migrations
3. **Test Stripe Keys**: Verify test mode access and webhook endpoints
4. **Review Documentation**: Read all shop-specific documentation files

### **During Development**:
1. **Incremental Changes**: Small, testable commits
2. **Regular Testing**: Continuous integration and deployment
3. **Security First**: Always validate inputs and verify signatures
4. **Documentation Updates**: Keep all documentation current

### **Production Readiness**:
1. **Full Testing**: Complete test suite passing
2. **Security Review**: All security checklist items verified
3. **Performance Check**: Load testing and optimization
4. **Rollback Plan**: Tested and documented rollback procedures

---

**This documentation provides complete context for implementing the Avanti Classic shop module using the latest 2025 Stripe features while maintaining the existing stable foundation.**

**Ready for e-commerce development with comprehensive guidance and safety measures in place!**