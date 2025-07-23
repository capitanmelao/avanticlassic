# API Documentation
## Avanticlassic Classical Music Platform

**Version**: 1.8.0  
**Last Updated**: July 23, 2025

---

## 🎯 Overview

The Avanticlassic API provides comprehensive endpoints for managing classical music content, e-commerce functionality, and multilingual content delivery.

### Base URLs
- **Production**: https://avanticlassic.vercel.app/api
- **Admin Panel**: https://avanticlassic-admin.vercel.app/api

---

## 📚 Public API Endpoints

### Content Management

#### 🎼 Artists
- **GET** `/api/artists` - Retrieve artists with pagination and language support
- **GET** `/api/artists/[slug]` - Get specific artist by slug

**Parameters:**
- `language` - Content language (en/fr/de)
- `page` - Page number for pagination
- `limit` - Items per page (default: 20)

#### 💿 Releases
- **GET** `/api/releases` - Retrieve releases catalog
- **GET** `/api/releases/[slug]` - Get specific release details

**Parameters:**
- `language` - Content language (en/fr/de)
- `category` - Filter by category
- `featured` - Show only featured releases (true/false)
- `page` - Page number for pagination
- `limit` - Items per page (default: 20)

#### 🎥 Videos
- **GET** `/api/videos` - Retrieve video gallery
- **GET** `/api/videos/[id]` - Get specific video details

**Parameters:**
- `limit` - Items per page (default: 20)
- `artist` - Filter by artist
- `page` - Page number for pagination

#### 🎵 Playlists
- **GET** `/api/playlists` - Retrieve curated playlists
- **GET** `/api/playlists/[id]` - Get specific playlist

**Parameters:**
- `category` - Filter by category (artist/composer/theme)
- `featured` - Show only featured playlists

#### 📝 Reviews
- **GET** `/api/reviews` - Retrieve critic reviews
- **GET** `/api/reviews/[id]` - Get specific review

**Parameters:**
- `featured` - Show only featured reviews (true/false)  
- `limit` - Items per page (default: 10)
- `release_id` - Filter by release

---

## 🛒 E-commerce API Endpoints

### Products & Cart
- **GET** `/api/products` - Retrieve product catalog
- **GET** `/api/products/[id]` - Get specific product details
- **POST** `/api/cart` - Add item to cart
- **GET** `/api/cart` - Retrieve cart contents
- **DELETE** `/api/cart/[id]` - Remove item from cart

### Payment Processing
- **POST** `/api/checkout` - Create Stripe checkout session
- **POST** `/api/webhooks/stripe` - Handle Stripe webhook events
- **GET** `/api/checkout/success` - Handle successful payment
- **GET** `/api/checkout/cancel` - Handle cancelled payment

**Stripe Integration:**
- Express Checkout (Apple Pay, Google Pay, Link)
- Session-based checkout flow
- Webhook verification for payment completion

---

## 🔧 Admin API Endpoints

### Authentication
- **POST** `/api/auth/login` - Admin login
- **POST** `/api/auth/logout` - Admin logout  
- **GET** `/api/auth/me` - Get current admin user

### Content Management (Admin Only)
- **POST** `/api/artists` - Create new artist
- **PUT** `/api/artists/[id]` - Update artist
- **DELETE** `/api/artists/[id]` - Delete artist

- **POST** `/api/releases` - Create new release
- **PUT** `/api/releases/[id]` - Update release
- **DELETE** `/api/releases/[id]` - Delete release

- **POST** `/api/videos` - Create new video
- **PUT** `/api/videos/[id]` - Update video
- **DELETE** `/api/videos/[id]` - Delete video

### System Management
- **GET** `/api/admin/analytics` - System analytics
- **GET** `/api/admin/audit-logs` - Admin action logs
- **POST** `/api/admin/users` - Create admin user
- **PUT** `/api/admin/users/[id]` - Update admin user

---

## 🌍 Multilingual Support

### Language Detection
All content endpoints support language parameters:
- `language=en` - English (default)
- `language=fr` - French
- `language=de` - German

### Translation System
- Automatic fallback to English if translation missing
- Real-time language switching
- SEO-optimized hreflang implementation

---

## 🔒 Authentication & Security

### Admin Authentication
- **Method**: Simple username/password with bcrypt hashing
- **Session**: HTTP-only cookies with 24-hour expiration
- **Roles**: Company Admin vs Super Admin permissions

### API Security
- **Rate Limiting**: Implemented on all endpoints
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries via Supabase
- **XSS Protection**: Content sanitization

---

## 📊 Response Formats

### Standard Response Structure
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "success": true
}
```

### Error Response Structure
```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "success": false,
  "code": "ERROR_CODE"
}
```

---

## 🚀 Performance Features

### Caching Strategy
- **Static Content**: 1 year cache for images/assets
- **API Responses**: Smart caching based on content type
- **Database Queries**: Optimized with strategic indexing

### Optimization
- **Pagination**: All list endpoints support pagination
- **Filtering**: Efficient database filtering on indexed columns  
- **Image Processing**: Automatic WebP/AVIF conversion
- **Compression**: Gzip compression on all responses

---

## 🔧 Development & Testing

### Local Development
```bash
# Main site
npm run dev

# Admin panel  
cd admin-panel && npm run dev
```

### Environment Configuration
- See `.env.example` files for required variables
- All production keys configured in Vercel dashboard
- Separate environments for development/production

### Database Integration
- **Supabase PostgreSQL** with Row Level Security
- **Real-time subscriptions** for live data updates
- **Automatic backups** and point-in-time recovery

---

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics**: Built-in performance tracking
- **Core Web Vitals**: Automated monitoring
- **Error Tracking**: Comprehensive error logging

### Usage Analytics
- **API Usage**: Request/response monitoring
- **User Behavior**: E-commerce conversion tracking
- **Content Performance**: Popular content metrics

---

## 🆘 Support & Troubleshooting

### Common Issues
1. **Authentication Errors**: Check session expiration
2. **Payment Failures**: Verify Stripe webhook configuration  
3. **Content Missing**: Check language fallback logic
4. **Database Errors**: Verify Supabase connection

### Error Codes
- `AUTH_REQUIRED` - Authentication needed
- `INVALID_PARAMS` - Request parameter validation failed
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error
- `NOT_FOUND` - Resource not found

### Contact
- **Technical Issues**: Check comprehensive audit report
- **Database Issues**: Review Supabase dashboard
- **Payment Issues**: Check Stripe dashboard logs

---

**Last Updated**: July 23, 2025  
**API Version**: 1.8.0  
**Documentation Status**: ✅ Current