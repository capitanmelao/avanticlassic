import type { Database } from './supabase';

// Database table types from Supabase
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type ProductPrice = Database['public']['Tables']['product_prices']['Row'];
export type ProductPriceInsert = Database['public']['Tables']['product_prices']['Insert'];
export type ProductPriceUpdate = Database['public']['Tables']['product_prices']['Update'];

export type Customer = Database['public']['Tables']['customers']['Row'];
export type CustomerInsert = Database['public']['Tables']['customers']['Insert'];
export type CustomerUpdate = Database['public']['Tables']['customers']['Update'];

export type CustomerAddress = Database['public']['Tables']['customer_addresses']['Row'];
export type CustomerAddressInsert = Database['public']['Tables']['customer_addresses']['Insert'];
export type CustomerAddressUpdate = Database['public']['Tables']['customer_addresses']['Update'];

export type CartItem = Database['public']['Tables']['cart_items']['Row'];
export type CartItemInsert = Database['public']['Tables']['cart_items']['Insert'];
export type CartItemUpdate = Database['public']['Tables']['cart_items']['Update'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];

export type ProductCategory = Database['public']['Tables']['product_categories']['Row'];
export type ProductCategoryInsert = Database['public']['Tables']['product_categories']['Insert'];
export type ProductCategoryUpdate = Database['public']['Tables']['product_categories']['Update'];

export type DiscountCode = Database['public']['Tables']['discount_codes']['Row'];
export type DiscountCodeInsert = Database['public']['Tables']['discount_codes']['Insert'];
export type DiscountCodeUpdate = Database['public']['Tables']['discount_codes']['Update'];

export type StripeWebhookEvent = Database['public']['Tables']['stripe_webhook_events']['Row'];
export type StripeWebhookEventInsert = Database['public']['Tables']['stripe_webhook_events']['Insert'];

// Extended types for UI components
export interface ProductWithPrices extends Product {
  product_prices: ProductPrice[];
  product_categories?: ProductCategory[];
  release?: {
    id: number;
    title: string;
    url: string;
    image_id?: number;
    release_date?: string;
    artists?: Array<{
      id: number;
      name: string;
      url: string;
    }>;
  };
}

export interface CartItemWithProduct extends CartItem {
  product: ProductWithPrices;
  price: ProductPrice;
}

export interface OrderWithItems extends Order {
  order_items: Array<OrderItem & {
    product?: Product;
    price?: ProductPrice;
  }>;
  customer?: Customer;
}

// Shopping cart context types
export interface CartState {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
}

export interface CartActions {
  addItem: (productId: number, priceId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
}

// Product format types
export type ProductFormat = 'cd' | 'sacd' | 'vinyl' | 'digital_download';
export type ProductType = 'physical' | 'digital';

export interface ProductVariant {
  id: number;
  format: ProductFormat;
  price: ProductPrice;
  inventory_quantity: number;
  available: boolean;
}

// Checkout types
export interface CheckoutSessionData {
  lineItems: Array<{
    productId: number;
    priceId: number;
    quantity: number;
  }>;
  customerEmail?: string;
  discountCode?: string;
  shippingAddress?: CustomerAddress;
  billingAddress?: CustomerAddress;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  payment_status: string;
  customer_email?: string;
  total_amount: number;
  currency: string;
}

// Currency and pricing types
export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'CAD' | 'AUD' | 'JPY';

export interface PriceDisplay {
  amount: number;
  currency: Currency;
  formatted: string;
}

export interface AdaptivePricing {
  base_price: number;
  currency: Currency;
  market_prices: Record<string, number>; // Country code -> price in cents
}

// Search and filtering types
export interface ProductFilter {
  categories?: number[];
  formats?: ProductFormat[];
  priceRange?: {
    min: number;
    max: number;
  };
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: ProductWithPrices[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

// Payment and order types
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled';

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

// Analytics and reporting types
export interface SalesAnalytics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  period: string;
  growth_rate?: number;
}

export interface ProductAnalytics {
  product_id: number;
  views: number;
  cart_additions: number;
  purchases: number;
  revenue: number;
  conversion_rate: number;
}

// Error types
export interface ShopError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: ShopError;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Webhook types
export type WebhookEventType =
  | 'checkout.session.completed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'invoice.payment_succeeded'
  | 'customer.created'
  | 'customer.updated'
  | 'product.created'
  | 'product.updated'
  | 'price.created'
  | 'price.updated';

export interface WebhookHandler {
  eventType: WebhookEventType;
  handler: (event: any) => Promise<void>;
}

// Admin types for the admin panel
export interface AdminProductForm {
  name: string;
  description?: string;
  release_id?: number;
  type: ProductType;
  format: ProductFormat;
  status: 'active' | 'inactive' | 'archived';
  images: string[];
  tax_code?: string;
  inventory_quantity: number;
  inventory_tracking: boolean;
  weight_grams?: number;
  dimensions_cm?: {
    length: number;
    width: number;
    height: number;
  };
  featured: boolean;
  prices: Array<{
    currency: Currency;
    amount: number;
    adaptive_pricing_enabled: boolean;
  }>;
  categories: number[];
}

export interface AdminOrderManagement {
  order: OrderWithItems;
  availableActions: Array<{
    action: string;
    label: string;
    available: boolean;
    reason?: string;
  }>;
  fulfillmentOptions: Array<{
    method: string;
    cost: number;
    estimated_delivery: string;
  }>;
}

// Customer account types
export interface CustomerProfile {
  customer: Customer;
  addresses: CustomerAddress[];
  orders: OrderWithItems[];
  preferences: {
    language: string;
    currency: Currency;
    marketing_consent: boolean;
  };
}

export interface CustomerOrderHistory {
  orders: OrderWithItems[];
  pagination: {
    page: number;
    total: number;
    hasMore: boolean;
  };
}

// Inventory management
export interface InventoryItem {
  product_id: number;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  is_out_of_stock: boolean;
}