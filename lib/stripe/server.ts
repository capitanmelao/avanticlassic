import Stripe from 'stripe';

// Initialize Stripe with the latest API version
// Handle missing secret key during build time
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-12-18.acacia',
  // Use the latest API version available
  typescript: true,
});

// Check if Stripe is properly configured
export const isStripeConfigured = !!process.env.STRIPE_SECRET_KEY;

// Stripe configuration
export const STRIPE_CONFIG = {
  currency: 'eur', // Default currency for Avanti Classic
  paymentMethodTypes: [
    'card',
    'sepa_debit',
    'paypal',
    'klarna',
    'ideal',
    'bancontact',
    'giropay',
    'eps',
    'p24',
    'sofort',
  ],
  // Webhook endpoint secret
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  // Adaptive pricing settings
  adaptivePricing: {
    enabled: process.env.STRIPE_ADAPTIVE_PRICING_ENABLED === 'true',
  },
  // Tax settings
  tax: {
    enabled: process.env.STRIPE_TAX_ENABLED === 'true',
  },
} as const;

// Utility functions for Stripe operations
export const stripeUtils = {
  /**
   * Format amount from cents to display value
   */
  formatAmount: (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  },

  /**
   * Convert display amount to cents
   */
  amountToCents: (amount: number): number => {
    return Math.round(amount * 100);
  },

  /**
   * Validate webhook signature
   */
  validateWebhookSignature: (
    payload: string | Buffer,
    signature: string
  ): Stripe.Event => {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        STRIPE_CONFIG.webhookSecret
      );
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  },

  /**
   * Create a product in Stripe
   */
  createProduct: async (productData: {
    name: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, string>;
    tax_code?: string;
  }): Promise<Stripe.Product> => {
    return await stripe.products.create({
      name: productData.name,
      description: productData.description,
      images: productData.images,
      metadata: productData.metadata || {},
      tax_code: productData.tax_code,
      shippable: true, // Physical products
    });
  },

  /**
   * Update a product in Stripe
   */
  updateProduct: async (
    productId: string,
    productData: {
      name?: string;
      description?: string;
      images?: string[];
      metadata?: Record<string, string>;
    }
  ): Promise<Stripe.Product> => {
    return await stripe.products.update(productId, {
      name: productData.name,
      description: productData.description,
      images: productData.images,
      metadata: productData.metadata,
    });
  },

  /**
   * Create a price for a product
   */
  createPrice: async (priceData: {
    product: string;
    currency: string;
    unit_amount: number;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Price> => {
    return await stripe.prices.create({
      product: priceData.product,
      currency: priceData.currency.toLowerCase(),
      unit_amount: priceData.unit_amount,
      metadata: priceData.metadata || {},
    });
  },

  /**
   * Create a checkout session
   */
  createCheckoutSession: async (sessionData: {
    customer_email?: string;
    line_items: Stripe.Checkout.SessionCreateParams.LineItem[];
    success_url: string;
    cancel_url: string;
    metadata?: Record<string, string>;
    shipping_address_collection?: boolean;
    automatic_tax?: boolean;
  }): Promise<Stripe.Checkout.Session> => {
    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: STRIPE_CONFIG.paymentMethodTypes,
      line_items: sessionData.line_items,
      mode: 'payment',
      success_url: sessionData.success_url,
      cancel_url: sessionData.cancel_url,
      metadata: sessionData.metadata || {},
      // Enable Stripe's enhanced UX features
      ui_mode: 'hosted', // Use Stripe's hosted checkout
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },
    };

    // Add customer email if provided
    if (sessionData.customer_email) {
      params.customer_email = sessionData.customer_email;
    }

    // Add shipping address collection if requested
    if (sessionData.shipping_address_collection) {
      params.shipping_address_collection = {
        allowed_countries: [
          'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'LU',
          'PT', 'IE', 'DK', 'SE', 'NO', 'FI', 'PL', 'CZ', 'HU',
          'SK', 'SI', 'HR', 'EE', 'LV', 'LT', 'BG', 'RO', 'GR',
          'CY', 'MT', 'US', 'CA', 'GB', 'AU', 'JP'
        ],
      };
    }

    // Add automatic tax if enabled
    if (sessionData.automatic_tax && STRIPE_CONFIG.tax.enabled) {
      params.automatic_tax = { enabled: true };
    }

    return await stripe.checkout.sessions.create(params);
  },

  /**
   * Retrieve a checkout session
   */
  getCheckoutSession: async (sessionId: string): Promise<Stripe.Checkout.Session> => {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'payment_intent'],
    });
  },

  /**
   * Create a customer
   */
  createCustomer: async (customerData: {
    email: string;
    name?: string;
    phone?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> => {
    return await stripe.customers.create({
      email: customerData.email,
      name: customerData.name,
      phone: customerData.phone,
      metadata: customerData.metadata || {},
    });
  },

  /**
   * Update a customer
   */
  updateCustomer: async (
    customerId: string,
    updateData: Partial<Stripe.CustomerUpdateParams>
  ): Promise<Stripe.Customer> => {
    return await stripe.customers.update(customerId, updateData);
  },

  /**
   * Get customer by email
   */
  getCustomerByEmail: async (email: string): Promise<Stripe.Customer | null> => {
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    return customers.data.length > 0 ? customers.data[0] : null;
  },
};

export default stripe;