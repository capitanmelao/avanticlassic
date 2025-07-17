# FRONTEND SPECIFICATION - Avanti Classic Shop Module

**Document Version**: 1.0  
**Date**: July 17, 2025  
**Scope**: UI/UX Design Guidelines for E-commerce Integration  
**Brand**: Avanti Classic - Classical Music Excellence  

## 🎨 **DESIGN PHILOSOPHY**

### **Core Principles**:
- **Elegance**: Classical music deserves sophisticated, refined presentation
- **Accessibility**: Universal design for all users and abilities
- **Performance**: Fast, responsive experience across all devices
- **Trust**: Secure, professional appearance for e-commerce transactions
- **Consistency**: Seamless integration with existing Avanti Classic brand

### **Visual Identity**:
- **Typography**: Playfair Display (existing) for headings, maintaining classical elegance
- **Color Palette**: Existing brand colors with e-commerce-specific additions
- **Spacing**: Generous whitespace reflecting classical music's sophisticated nature
- **Imagery**: High-quality product images with consistent styling
- **Animations**: Subtle, refined transitions that enhance rather than distract

## 🎯 **USER EXPERIENCE FLOWS**

### **Customer Journey Mapping**:
```
Discovery → Product Details → Cart → Checkout → Confirmation → Account Management
    ↓            ↓           ↓        ↓           ↓              ↓
Homepage     Product Page   Cart    Stripe     Success     Order History
   ↓            ↓           ↓      Checkout      ↓              ↓
Artist      Add to Cart   Review   Payment   Order Email   Profile Mgmt
Collection     ↓           ↓        ↓           ↓              ↓
   ↓      Quick Actions  Modify   Complete  Fulfillment   Preferences
Catalog      ↓           ↓        ↓           ↓              ↓
   ↓      Save/Wishlist Continue Guest/Login Track Order  Support
Search       ↓           ↓        ↓           ↓              ↓
   ↓      Recommendations Update  Mobile Pay  Feedback    Reorder
Filter       ↓           ↓        ↓           ↓              ↓
   ↓      Compare      Checkout  Security   Reviews     Recommendations
Results      ↓           ↓        ↓           ↓              ↓
   ↓      Share       Promo    Confirm    Follow-up   Account Settings
Product      ↓           ↓        ↓           ↓              ↓
Detail    Related     Apply    Receipt   Community    Subscription
```

### **Key User Flows**:

#### **Browse & Discovery**:
1. **Homepage Entry**: Featured products, categories, search
2. **Product Catalog**: Filtering, sorting, pagination
3. **Search Results**: Relevant results with refinement options
4. **Category Navigation**: Clear hierarchy and breadcrumbs

#### **Product Interaction**:
1. **Product Detail**: Images, descriptions, variants, reviews
2. **Quick Actions**: Add to cart, wishlist, share
3. **Recommendations**: Related products, bundle offers
4. **Comparison**: Side-by-side product comparison

#### **Purchase Flow**:
1. **Cart Management**: Add, remove, modify quantities
2. **Checkout Process**: Guest/registered user options
3. **Payment**: Multiple payment methods, secure processing
4. **Confirmation**: Order summary, tracking information

#### **Account Management**:
1. **Registration**: Simple, optional account creation
2. **Login**: Quick, secure authentication
3. **Profile**: Personal information, preferences
4. **Order History**: Past purchases, reorder options

## 🛍️ **SHOP-SPECIFIC COMPONENTS**

### **Product Catalog Components**:

#### **Product Card**:
```typescript
interface ProductCardProps {
  product: Product
  size?: 'small' | 'medium' | 'large'
  showQuickAdd?: boolean
  showWishlist?: boolean
  layout?: 'grid' | 'list'
}
```

**Design Specifications**:
- **Aspect Ratio**: 3:4 for album covers (consistent with music industry)
- **Image**: High-quality product image with hover effects
- **Title**: Product name with proper typography hierarchy
- **Artist**: Artist name with link to artist page
- **Price**: Clear, prominent pricing with currency formatting
- **Format**: Badge indicating CD, SACD, Vinyl, Digital
- **Actions**: Add to cart, wishlist, quick view buttons
- **Hover State**: Subtle elevation and overlay actions

#### **Product Grid**:
```typescript
interface ProductGridProps {
  products: Product[]
  columns?: { mobile: number, tablet: number, desktop: number }
  loading?: boolean
  emptyState?: ReactNode
}
```

**Layout Specifications**:
- **Mobile**: 2 columns with compact product cards
- **Tablet**: 3 columns with medium product cards
- **Desktop**: 4 columns with full-featured product cards
- **Spacing**: Consistent gutters, responsive padding
- **Loading**: Skeleton placeholders matching card dimensions

### **Shopping Cart Components**:

#### **Cart Icon** (Header):
```typescript
interface CartIconProps {
  itemCount: number
  total: number
  isOpen?: boolean
  onToggle?: () => void
}
```

**Design Specifications**:
- **Position**: Header navigation, right-aligned
- **Badge**: Item count with subtle animation on updates
- **Indicator**: Visual feedback for cart updates
- **Accessibility**: Screen reader friendly, keyboard navigable

#### **Cart Drawer**:
```typescript
interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  total: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}
```

**Design Specifications**:
- **Slide Animation**: Smooth slide-in from right
- **Item Display**: Product image, name, price, quantity controls
- **Totals**: Clear subtotal, tax, shipping, total breakdown
- **Actions**: Continue shopping, proceed to checkout
- **Empty State**: Encouraging message with suggested products

### **Checkout Components**:

#### **Checkout Form**:
```typescript
interface CheckoutFormProps {
  onSubmit: (data: CheckoutData) => void
  loading?: boolean
  error?: string
  stripePromise: Promise<Stripe | null>
}
```

**Design Specifications**:
- **Step Indicator**: Clear progress through checkout stages
- **Form Sections**: Contact, shipping, payment, review
- **Validation**: Real-time validation with helpful error messages
- **Security**: Trust indicators, SSL badges, secure payment messaging
- **Mobile**: Optimized for mobile checkout experience

### **Account Components**:

#### **Order History**:
```typescript
interface OrderHistoryProps {
  orders: Order[]
  loading?: boolean
  onReorder: (orderId: string) => void
  onViewDetails: (orderId: string) => void
}
```

**Design Specifications**:
- **Order Card**: Date, status, items, total
- **Status Badges**: Color-coded order status indicators
- **Actions**: View details, reorder, track shipment
- **Pagination**: Load more or pagination for long lists

## 🎨 **VISUAL DESIGN SYSTEM**

### **Typography**:
```css
/* Headings - Playfair Display (existing) */
.shop-heading-1 { font-family: 'Playfair Display'; font-size: 2.5rem; font-weight: 700; }
.shop-heading-2 { font-family: 'Playfair Display'; font-size: 2rem; font-weight: 600; }
.shop-heading-3 { font-family: 'Playfair Display'; font-size: 1.5rem; font-weight: 600; }

/* Body Text - System Font Stack */
.shop-body-large { font-size: 1.125rem; line-height: 1.6; }
.shop-body-medium { font-size: 1rem; line-height: 1.5; }
.shop-body-small { font-size: 0.875rem; line-height: 1.4; }

/* Labels & UI Text */
.shop-label { font-size: 0.875rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
.shop-price { font-size: 1.25rem; font-weight: 600; }
.shop-price-large { font-size: 1.5rem; font-weight: 700; }
```

### **Color Palette**:
```css
/* Primary Colors (existing brand) */
--color-primary: #1a1a1a;          /* Main brand color */
--color-primary-light: #333333;    /* Lighter primary */
--color-primary-dark: #000000;     /* Darker primary */

/* Secondary Colors */
--color-secondary: #8b5a2b;        /* Classical music gold */
--color-secondary-light: #b8834a;  /* Lighter gold */
--color-secondary-dark: #6b421f;   /* Darker gold */

/* E-commerce Specific Colors */
--color-success: #16a34a;          /* Success states, in stock */
--color-warning: #f59e0b;          /* Warning states, low stock */
--color-error: #dc2626;            /* Error states, out of stock */
--color-info: #3b82f6;             /* Info states, shipping */

/* Neutral Colors */
--color-gray-50: #f9fafb;          /* Light backgrounds */
--color-gray-100: #f3f4f6;         /* Card backgrounds */
--color-gray-200: #e5e7eb;         /* Borders */
--color-gray-300: #d1d5db;         /* Disabled states */
--color-gray-400: #9ca3af;         /* Placeholder text */
--color-gray-500: #6b7280;         /* Secondary text */
--color-gray-600: #4b5563;         /* Primary text */
--color-gray-700: #374151;         /* Headings */
--color-gray-800: #1f2937;         /* Dark backgrounds */
--color-gray-900: #111827;         /* High contrast text */
```

### **Spacing System**:
```css
/* Spacing Scale (Tailwind-based) */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### **Border Radius**:
```css
--radius-sm: 0.125rem;     /* 2px - small elements */
--radius-md: 0.375rem;     /* 6px - buttons, cards */
--radius-lg: 0.5rem;       /* 8px - large cards */
--radius-xl: 0.75rem;      /* 12px - modals */
--radius-2xl: 1rem;        /* 16px - hero sections */
--radius-full: 9999px;     /* Full - badges, avatars */
```

### **Shadows**:
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## 📱 **RESPONSIVE DESIGN**

### **Breakpoints**:
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm - Small tablets */ }
@media (min-width: 768px) { /* md - Tablets */ }
@media (min-width: 1024px) { /* lg - Small desktops */ }
@media (min-width: 1280px) { /* xl - Large desktops */ }
@media (min-width: 1536px) { /* 2xl - Extra large */ }
```

### **Mobile-First Design Principles**:
- **Touch Targets**: Minimum 44px for touch interactions
- **Thumb Navigation**: Important actions within thumb reach
- **Simplified Navigation**: Collapsible menus, clear hierarchy
- **Optimized Images**: Responsive images with appropriate sizes
- **Fast Loading**: Minimal JavaScript, optimized assets

### **Tablet Considerations**:
- **Adaptive Layout**: 3-column grid for product catalogs
- **Enhanced Interactions**: Hover states, drag-and-drop
- **Landscape Mode**: Optimized for horizontal orientation
- **Touch + Mouse**: Support for both input methods

### **Desktop Enhancements**:
- **Rich Interactions**: Hover effects, animations
- **Keyboard Navigation**: Full keyboard accessibility
- **Multi-Column Layouts**: Efficient use of screen space
- **Advanced Filtering**: Sophisticated product filtering options

## 🔄 **INTERACTION PATTERNS**

### **Loading States**:
```typescript
// Loading patterns for different components
interface LoadingState {
  skeleton: boolean;    // Skeleton placeholders
  spinner: boolean;     // Loading spinners
  progressive: boolean; // Progressive loading
  optimistic: boolean;  // Optimistic updates
}
```

### **Error States**:
```typescript
// Error handling patterns
interface ErrorState {
  inline: boolean;      // Inline error messages
  toast: boolean;       // Toast notifications
  page: boolean;        // Error pages
  retry: boolean;       // Retry mechanisms
}
```

### **Success States**:
```typescript
// Success feedback patterns
interface SuccessState {
  confirmation: boolean; // Confirmation messages
  animation: boolean;    // Success animations
  redirect: boolean;     // Automatic redirects
  notification: boolean; // Success notifications
}
```

## 🎯 **ACCESSIBILITY GUIDELINES**

### **WCAG 2.1 AA Compliance**:
- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Logical tab order, visible focus indicators
- **Alternative Text**: Descriptive alt text for all images

### **E-commerce Specific Accessibility**:
- **Product Information**: Clear, structured product details
- **Price Formatting**: Consistent currency and number formatting
- **Cart Updates**: Screen reader announcements for cart changes
- **Checkout Process**: Clear progress indicators and instructions
- **Error Messages**: Specific, actionable error descriptions

## 🔒 **SECURITY & TRUST INDICATORS**

### **Visual Trust Elements**:
- **SSL Indicators**: Secure connection badges
- **Payment Security**: Payment method logos and security badges
- **Privacy Policy**: Clear links to privacy and security information
- **Customer Reviews**: Authentic customer feedback display
- **Company Information**: Clear contact and company details

### **Form Security**:
- **Input Validation**: Real-time validation with clear feedback
- **Password Strength**: Visual password strength indicators
- **Secure Fields**: Visual indicators for secure form fields
- **Auto-complete**: Secure auto-complete for address and payment fields

## 🚀 **PERFORMANCE CONSIDERATIONS**

### **Loading Performance**:
- **Critical Path**: Prioritize above-the-fold content
- **Image Optimization**: WebP format, lazy loading, responsive images
- **Code Splitting**: Component-based code splitting
- **Caching Strategy**: Intelligent caching for product data

### **Runtime Performance**:
- **Virtual Scrolling**: For large product catalogs
- **Debounced Search**: Optimized search input handling
- **Memoization**: React.memo for expensive components
- **State Management**: Efficient state updates and subscriptions

---

**This frontend specification ensures a cohesive, accessible, and performant e-commerce experience that maintains the sophisticated elegance of the Avanti Classic brand while providing modern shopping functionality.**

**Implementation Priority**: Focus on mobile-first design with progressive enhancement for larger screens, ensuring excellent user experience across all devices.