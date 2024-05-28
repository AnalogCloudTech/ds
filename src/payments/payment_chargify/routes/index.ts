// subscriptions
export const ROUTE_SUBSCRIPTION_CREATE = '/subscriptions.json';

export const ROUTE_SUBSCRIPTION_UPDATE = '/subscriptions/:id.json';

export const ROUTE_SUBSCRIPTION_PURGE = '/subscriptions/:id/purge.json';

export const ROUTE_SUBSCRIPTION_ACTIVATE =
  '/subscriptions/:subscriptionId/activate.json';

// invoices
export const ROUTE_INVOICE_CREATE = '/subscriptions/:id/invoices.json';
export const ROUTE_INVOICE_LIST = '/invoices.json';
export const ROUTE_INVOICE_VOID = '/invoices/:id/void.json';
export const ROUTE_INVOICE = '/invoices/:id.json';
export const ROUTE_SEND_INVOICE = '/invoices/:id/deliveries.json';
export const ROUTE_INVOICE_REFUND = '/invoices/:uid/refunds.json';

// payment
export const ROUTE_PAYMENT_CREATE = '/invoices/:id/payments.json';

// payment profile
export const ROUTE_PAYMENT_PROFILE_CREATE = '/payment_profiles.json';
export const ROUTE_PAYMENT_PROFILE_UPDATE = '/payment_profiles/:id.json';

// metaData of resource
export const ROUTE_RESOURCE_METADATA = '/_type/_id/metadata.json';

// customers
export const ROUTE_CUSTOMERS_LIST = '/customers.json?q=:query';
export const ROUTE_CUSTOMERS_SUBSCRIPTIONS =
  '/customers/:id/subscriptions.json';

// subscription events
export const ROUTE_SUBSCRIPTION_EVENTS = '/subscriptions/:id/events.json';
export const ROUTE_SUBSCRIPTION_BY_ID = '/subscriptions/:id.json';
export const ROUTE_SUBSCRIPTION_COMPONENT =
  '/subscriptions/:id/components.json';

// components
export const ROUTE_SUBSCRIPTION_COMPONENTS =
  'subscriptions/:id/components.json';
export const ROUTE_COMPONENT_PRICE_BY_PRICE_POINT_ID =
  'components/:id/price_points.json';

// allocations
export const ROUTE_PREVIEW_ALLOCATION =
  '/subscriptions/:id/allocations/preview.json';
export const ROUTE_COMPONENT_ALLOCATION = '/subscriptions/:id/allocations.json';

export const ROUTE_COMPONENT_MIGRATE_SUBSCRIPTION =
  '/subscriptions/:id/migrations.json';

export const ROUTE_GET_PRODUCT_BY_HANDLE = '/products/handle/:id.json';
export const ROUTE_GET_COMPONENT_BY_HANDLE = '/components/lookup.json';
