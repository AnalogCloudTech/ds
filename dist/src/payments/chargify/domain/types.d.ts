export type Subscription = {
    id: number;
    state: State;
    activated_at: string;
    balance_in_cents: string;
    cancel_at_end_of_period: string;
    canceled_at: string;
    cancellation_message: string;
    coupon_code: string;
    created_at: string;
    current_period_ends_at: string;
    current_period_started_at: string;
    delayed_cancel_at: string;
    expires_at: string;
    next_assessment_at: string;
    previous_state: string;
    payment_type: string;
    signup_payment_id: string;
    signup_revenue: string;
    total_revenue_in_cents: string;
    trial_ended_at: string;
    trial_started_at: string;
    updated_at: string;
    currency: string;
    customer: Customer;
    product: Product;
    credit_card: CreditCard;
    product_price_in_cents: number;
    last_payment_error?: LastPaymentError;
    name?: string;
    [key: string]: any;
};
export type SubscriptionUpdated = {
    id: number;
    state: State;
    name: string;
    organization: string;
    product: ProductUpdated;
};
export declare enum PricingScheme {
    PER_UNIT = "per_unit"
}
export type SendInvoiceEmails = {
    recipient_emails: string[];
    cc_recipient_emails?: string[];
    bcc_receipient_emails?: string[];
};
export type SubscriptionComponent = {
    component_id: number;
    subscription_id: number;
    allocated_quantity: number;
    pricing_scheme: PricingScheme | null;
    name: string;
    kind: string;
    unit_name: string;
    price_point_id: number | null;
    price_point_handle: string | null;
    enabled: boolean;
    id?: number;
    currency?: string;
    component_handle?: string;
    allow_fractional_quantities?: boolean;
    recurring?: boolean;
    description?: string;
    archived_at?: string | null;
    price_point_type?: string;
    price_point_name?: string;
    use_site_exchange_rate?: boolean;
    product_family_id?: number;
    product_family_handle?: string;
    created_at?: string;
    updated_at?: string;
    unitPrice?: string;
    [key: string]: any;
};
export type SubscriptionUpdatedComponentTypes = {
    id: number;
    name: string;
    kind: string;
    unit_name: string;
    handle: string;
};
export type SubscriptionResponseObject = {
    subscription: Subscription;
};
export type CreateSubscriptionErrorResponseObject = {
    errors: Array<string>;
};
export type SubscriptionComponentResponseObject = {
    component: SubscriptionComponent;
};
export type LastPaymentError = {
    message?: string;
};
export type CreditCard = {
    customer_id: string;
    id: string;
    first_name: string;
    last_name: string;
    billing_address: string;
    billing_address_2: string;
    billing_city: string;
    billing_country: string;
    billing_state: string;
    billing_zip: string;
    card_type: string;
    current_vault: string;
    expiration_month: string;
    expiration_year: string;
    masked_card_number: string;
    vault_token: string;
    customer_vault_token: string;
};
export type Customer = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    address_2: string;
    city: string;
    country: string;
    created_at: Date;
    organization: string;
    reference: string;
    state: string;
    updated_at: Date;
    zip: string;
};
export type ProductFamily = {
    accounting_code: string;
    description: string;
    handle: string;
    id: string;
    name: string;
};
export type ProductUpdated = {
    id: number;
    product_price_point_id?: number;
    product_price_point_handle?: string;
    interval: number;
    interval_unit: string;
    name: string;
};
export type Product = {
    id: string;
    accounting_code: string;
    archived_at: Date;
    created_at: Date;
    description: string;
    expiration_interval: string;
    expiration_interval_unit: string;
    handle: string;
    initial_charge_in_cents: string;
    interval: string;
    interval_unit: string;
    name: string;
    price_in_cents: string;
    request_credit_card: string;
    require_credit_card: string;
    return_params: string;
    return_url: string;
    trial_interval: string;
    trial_interval_unit: string;
    trial_price_in_cents: string;
    update_return_url: string;
    updated_at: Date;
    use_site_exchange_rate: string;
    product_family: ProductFamily;
};
export type ProductResult = {
    product: Product;
};
export type MetadataPaginationSchema = {
    total_count: number;
    current_page: number;
    total_pages: number;
    per_page: number;
    metadata: Array<Metadata>;
};
export type Metadata = {
    id: number;
    value: string;
    resource_id: number;
    metafield_id: number;
    deleted_at?: Date;
    name: string;
};
export type Transaction = {
    id: number;
    invoice_uids: Array<number>;
    created_at: string;
    kind: string;
    component_id: number;
    transaction_type: string;
};
export type AllocationUpdated = {
    id: number;
    proration_upgrade_scheme: string;
    proration_downgrade_scheme: string;
};
export type TransactionExchangeRateUpdated = {
    rate_type: string;
    actual_rate: number;
    reporting_rate: number;
};
export type PaymentUpdated = {
    id: number;
    success: boolean;
    amount_in_cents: number;
    memo: string;
};
export declare class Site {
    id: number;
    subdomain: string;
}
export declare class SubscriptionPayload {
    site: Site;
    subscription: Subscription;
    transaction: Transaction;
    event_id: number;
    timestamp: string;
    component: Component;
}
export declare class RenewalSuccessPayload {
    site: Site;
    subscription: Subscription;
    event_id: number;
}
interface Price {
    id: number;
    component_id: number;
    starting_quantity: number;
    ending_quantity: number | null;
    unit_price: string;
    price_point_id: number;
    formatted_unit_price: string;
    segment_id: number | null;
}
export declare class Component {
    id: number;
    name: string;
    handle: string;
    pricing_scheme: string;
    unit_name: string;
    unit_price: string;
    product_family_id: number;
    product_family_name: string;
    price_per_unit_in_cents: number | null;
    kind: string;
    archived: boolean;
    taxable: boolean;
    description: string;
    default_price_point_id: number;
    prices: Price[];
    price_point_count: number;
    price_points_url: string;
    default_price_point_name: string;
    tax_code: string;
    recurring: boolean;
    upgrade_charge: number | null;
    downgrade_credit: number | null;
    created_at: string;
    updated_at: string;
    archived_at: string | null;
    hide_date_range_on_invoice: boolean;
    allow_fractional_quantities: boolean;
    use_site_exchange_rate: boolean;
    item_category: string | null;
    accounting_code: string | null;
}
export declare class ComponentDto {
    component: Component;
}
export declare class InvoiceIssuedSubscription {
    id: string;
    current_period_ends_at: string;
}
export declare class InvoiceIssuedInvoice {
    uid: string;
    number: string;
    role: string;
    due_date: string;
    issue_date: string;
    paid_date: string;
    due_amount: string;
    paid_amount: string;
    refund_amount: string;
    tax_amount: string;
    total_amount: string;
    status_amount: string;
    product_name: string;
    line_items: Record<string, LineItem>;
    consolidation_level: string;
}
declare class LineItem {
    uid: string;
    title: string;
    description: string;
    quantity: number;
    quantity_delta: null | number;
    unit_price: string;
    period_range_start: string;
    period_range_end: string;
    amount: string;
    line_references: string;
    pricing_details_index: null | number;
    pricing_details: Record<string, any>;
    tax_code: null | string;
    tax_amount: string;
    product_id: number;
    product_price_point_id: number;
    price_point_id: number;
    component_id: number;
    billing_schedule_item_id: null | number;
    custom_item: null | string;
}
export declare class InvoiceIssuedPayload {
    message: string;
    site: Site;
    subscription: InvoiceIssuedSubscription;
    invoice: InvoiceIssuedInvoice;
    event_id: string;
}
export declare class SubscriptionUpdatedPayload {
    site: Site;
    component: SubscriptionUpdatedComponentTypes;
    subscription: SubscriptionUpdated;
    product: ProductUpdated;
    allocation: AllocationUpdated;
    transaction_exchange_rate: TransactionExchangeRateUpdated;
    previous_allocation: number;
    new_allocation: number;
    memo: string;
    timestamp: string;
    price_point_id: number;
    payment: PaymentUpdated;
    event_id: number;
}
export declare class WebhookPayload<T = any> {
    id: number;
    event: string;
    payload: T;
    [key: string]: any;
}
export declare enum State {
    ACTIVE = "active",
    CANCELED = "canceled",
    EXPIRED = "expired",
    ON_HOLD = "on_hold",
    PAST_DUE = "past_due",
    SOFT_FAILURE = "soft_failure",
    TRIALING = "trialing",
    TRIAL_ENDED = "trial_ended",
    UNPAID = "unpaid",
    SUSPENDED = "suspended",
    AWAITING_SIGNUP = "awaiting_signup"
}
export interface SubscriptionInvoice {
    invoice: Invoice;
}
export interface Invoice {
    uid: string;
    site_id: number;
    customer_id: number;
    subscription_id: number;
    number: string;
    sequence_number: number;
    issue_date: string;
    due_date: string;
    paid_date?: null;
    status: string;
    collection_method: string;
    payment_instructions: string;
    currency: string;
    consolidation_level: string;
    parent_invoice_uid?: null;
    parent_invoice_number?: null;
    group_primary_subscription_id?: null;
    product_name: string;
    product_family_name: string;
    role: string;
    seller: Seller;
    customer: SubscriptionCustomer;
    memo: string;
    billing_address: AddressOrBillingAddressOrShippingAddress;
    shipping_address: AddressOrBillingAddressOrShippingAddress;
    subtotal_amount: string;
    discount_amount: string;
    tax_amount: string;
    total_amount: string;
    credit_amount: string;
    paid_amount: string;
    refund_amount: string;
    due_amount: string;
    line_items?: LineItemsEntity[] | null;
    discounts?: null[] | null;
    taxes?: null[] | null;
    credits?: null[] | null;
    payments?: null[] | null;
    refunds?: null[] | null;
    custom_fields?: null[] | null;
    public_url: string;
    invoice_download?: string;
}
export interface InvoiceList {
    invoices: Invoice[];
    meta: InvoiceMeta;
}
export interface InvoiceMeta {
    status_code: number;
    total_invoice_count: number;
    current_page: number;
}
interface Seller {
    name: string;
    address: AddressOrBillingAddressOrShippingAddress;
    phone: string;
}
interface AddressOrBillingAddressOrShippingAddress {
    street?: null;
    line2?: null;
    city?: null;
    state?: null;
    zip?: null;
    country?: null;
}
interface SubscriptionCustomer {
    chargify_id: number;
    first_name: string;
    last_name: string;
    organization?: null;
    email: string;
    vat_number?: null;
    reference?: null;
}
interface LineItemsEntity {
    uid: string;
    title: string;
    description: string;
    quantity: string;
    unit_price: string;
    subtotal_amount: string;
    discount_amount: string;
    tax_amount: string;
    total_amount: string;
    tiered_unit_price: boolean;
    period_range_start: string;
    period_range_end: string;
    product_id?: null;
    product_version?: null;
    product_price_point_id?: null;
    component_id?: null;
    price_point_id?: null;
}
export interface PaymentProfiles {
    payment_profile: PaymentProfile;
}
export interface PaymentProfile {
    id: number;
    first_name: string;
    last_name: string;
    customer_id: number;
    current_vault: string;
    vault_token: string;
    billing_address: string;
    billing_city: string;
    billing_state: string;
    billing_zip: string;
    billing_country: string;
    customer_vault_token?: null;
    billing_address_2: string;
    bank_name?: string;
    masked_bank_routing_number?: string;
    masked_bank_account_number?: string;
    bank_account_type?: string;
    bank_account_holder_type?: string;
    payment_type: string;
    site_gateway_setting_id: number;
    gateway_handle?: null;
    masked_card_number?: string;
    disabled?: boolean;
    card_type?: string;
    expiration_month?: number;
    expiration_year?: number;
    expired?: boolean;
    default?: boolean;
    email?: string;
}
export interface ClickFunnelsPayload {
    purchase: ClickFunnelsPurchasePayload;
    event: string;
}
export interface ClickFunnelsPurchasePayload {
    id: number;
    products: ClickFunnelsProducts;
    member_id: unknown;
    contact: ClickFunnelsContact;
    funnel_id: number;
    stripe_customer_token: string;
    created_at: string;
    updated_at: string;
    subscription_id: string;
    charge_id: unknown;
    ctransreceipt: unknown;
    status: string;
    fulfillment_status: unknown;
    fulfillment_id: unknown;
    payments_count: unknown;
    infusionsoft_ccid: unknown;
    oap_customer_id: unknown;
    payment_instrument_type: unknown;
    original_amount_cents: number;
    original_amount: ClickFunnelsOriginalAmount;
}
export interface ClickFunnelsProducts {
    id: number;
    name: string;
    stripe_plan: string;
    amount: ClickFunnelsProductPriceConfig;
    amount_currency: string;
    created_at: string;
    updated_at: string;
    subject: unknown;
    html_body: unknown;
    thank_you_page_id: number;
    stripe_cancel_after_payments: unknown;
    bump: boolean;
    cart_product_id: unknown;
    billing_integration: string;
    infusionsoft_product_id: unknown;
    infusionsoft_subscription_id: unknown;
    ontraport_product_id: unknown;
    ontraport_payment_count: unknown;
    ontraport_payment_type: unknown;
    ontraport_unit: unknown;
    ontraport_gateway_id: unknown;
    ontraport_invoice_id: unknown;
    commissionable: boolean;
    statement_descriptor: string;
    netsuite_id: unknown;
    netsuite_tag: unknown;
    netsuite_class: unknown;
    description: string;
    original_amount_currency: string;
    manual: boolean;
    error_message: unknown;
    nmi_customer_vault_id: unknown;
}
interface ClickFunnelsProductPriceConfig {
    cents: number;
    currency_iso: string;
}
export interface ClickFunnelsContact {
    id: number;
    page_id: number;
    first_name: string;
    last_name: string;
    name: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
    webinar_at: unknown;
    webinar_last_time: unknown;
    webinar_ext: string;
    created_at: string;
    updated_at: string;
    ip: string;
    funnel_id: number;
    funnel_step_id: number;
    unsubscribed_at?: string;
    cf_uvid: string;
    cart_affiliate_id: string;
    shipping_address: string;
    shipping_city: string;
    shipping_country: string;
    shipping_state: string;
    shipping_zip: string;
    vat_number: string;
    affiliate_id: unknown;
    aff_sub: string;
    aff_sub2: string;
    cf_affiliate_id: unknown;
    contact_profile: ClickFunnelsContactProfile;
    additional_info: ClickFunnelsAdditionalInfo;
    time_zone: string;
    password: string;
    book_packages: string[];
    text: string;
    text_message_opt_in: string;
    book_credits: number;
}
export interface ClickFunnelsContactProfile {
    id: number;
    first_name: string;
    last_name: string;
    address: string;
    city: string;
    country: string;
    state: string;
    zip: string;
    email: string;
    phone: string;
    created_at: string;
    updated_at: string;
    unsubscribed_at?: string;
    cf_uvid: string;
    shipping_address: string;
    shipping_country: unknown;
    shipping_city: unknown;
    shipping_state: unknown;
    shipping_zip: unknown;
    vat_number: unknown;
    middle_name: unknown;
    websites: unknown;
    location_general: unknown;
    normalized_location: unknown;
    deduced_location: unknown;
    age: unknown;
    gender: unknown;
    age_range_lower: unknown;
    age_range_upper: unknown;
    action_score: unknown;
    known_ltv: string;
    tags: string[];
    time_zone: unknown;
    lists_names: string;
    globally_unsubscribed: boolean;
    tags_names: string;
}
interface ClickFunnelsAdditionalInfo {
    cf_affiliate_id: string;
    time_zone: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term: string;
    utm_content: string;
    cf_uvid: string;
    webinar_delay: string;
    purchase: ClickFunnelsPurchase;
    password: string;
    book_packages: string[];
    text: string;
    text_message_opt_in: string;
    book_credits: number;
}
interface ClickFunnelsPurchase {
    product_ids: string[];
    payment_method_nonce: string;
    order_saas_url: string;
    stripe_customer_token: string;
}
interface ClickFunnelsOriginalAmount {
    cents: number;
    currency_iso: string;
}
export interface ClickFunnelsContactInfo {
    afy_package: string[];
    password: string;
    text_message_opt_in: string;
    firstname: string;
    lastname: string;
    email: string;
}
export interface SessionOnboardSales {
    customerInfo: {
        email: string;
    };
    dealDetails: {
        dealId: string;
        dealExists: boolean;
        email: string;
    };
}
export {};
