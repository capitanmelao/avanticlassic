# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎉 **MAJOR UPDATE - JULY 18, 2025**

**✅ E-COMMERCE SHOP SYSTEM COMPLETE & OPTIMIZED**  
Full Stripe-integrated shopping platform with database-driven product catalog successfully implemented, deployed, and optimized for user experience.

### ✅ Latest Session Achievements (July 18, 2025)

#### **E-COMMERCE SYSTEM IMPLEMENTATION**
- **Status**: ✅ Production Ready and Deployed
- **Current Tag**: `v1.2.0-shop-complete`
- **Previous Tag**: `v1.1.0-ecommerce-complete`
- **Shop URL**: https://avanticlassic.vercel.app/shop
- **Products**: 37 classical music releases available for purchase

#### **Key Features Implemented:**
- ✅ **Complete Shop System** - Product catalog, cart, and Stripe checkout
- ✅ **Database Integration** - 37 products populated from releases table
- ✅ **Shopping Cart** - Persistent cart with localStorage and React Context
- ✅ **Stripe Payment Processing** - Live API integration with secure checkout
- ✅ **Order Management** - Complete order tracking and customer system
- ✅ **API Routes** - Products, cart, checkout, orders, and Stripe webhooks
- ✅ **Mobile Optimized** - Responsive design for all screen sizes
- ✅ **Direct Purchase** - Buy buttons on release pages with correct pricing
- ✅ **Simplified Shop** - Streamlined shop page focused on products

#### **Critical Issues Resolved:**
- ✅ **Database Queries** - Fixed column names and relationship syntax
- ✅ **Environment Variables** - Correct Supabase client configuration
- ✅ **Build Dependencies** - Added missing Stripe packages
- ✅ **Production Deployment** - All environment variables configured in Vercel
- ✅ **Pricing Display** - Fixed €0.00 issue, now shows correct prices (€14.00 CD, €16.00 Hybrid SACD)
- ✅ **Format Mapping** - Fixed database constraints and format capitalization
- ✅ **UUID Compatibility** - Updated product creation for UUID-based schema

## Vercel Project Management

### Deployment Notes
- We have already created Vercel projects for:
  - Admin Panel: https://avanticlassic-admin.vercel.app
  - Web Application: https://avanticlassic.vercel.app
- Do not create new Vercel projects
- Deployments and changes are seen directly on Vercel
- No local development version is maintained

## Session Workflow

### Project Initialization
- In each new session, check the project folder and perform an exhaustive audit and check of all files to:
  - Understand the current project environment
  - Gain comprehensive context about the project's current state
  - Identify any potential issues or areas for improvement