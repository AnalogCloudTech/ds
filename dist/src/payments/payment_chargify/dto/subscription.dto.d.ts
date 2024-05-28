import { Product, SubscriptionComponent } from '@/payments/chargify/domain/types';
import { Customer } from './customer.dto';
export declare class SubscriptionDto {
    customer_id?: number;
    product_handle?: string;
    product_id?: number;
    next_billing_at?: any;
    customer_attributes: Customer;
    components?: Array<Pick<SubscriptionComponent, 'component_id' | 'allocated_quantity'>>;
    credit_card_attributes?: CreditCardAttributes;
    metafields?: {
        [key: string]: any;
    };
}
export declare class CreditCardAttributes {
    full_number?: string;
    expiration_month?: string;
    expiration_year?: string;
    first_name?: string;
    payment_type?: string;
    chargify_token?: string;
    last_name?: string;
    current_vault?: string;
    vault_token?: string;
    gateway_handle?: string;
}
export declare class updatePaymentMethod {
    credit_card_attributes?: CreditCardAttributes;
    next_billing_at?: string;
    product_handle?: string;
}
export declare class CreateSubscriptionDto {
    subscription: SubscriptionDto;
}
export declare class ProductChange {
    product_id: string;
    product_handle: string;
}
export declare class UpdateSubscriptionDto {
    subscription: updatePaymentMethod;
}
export declare class PurgeQuery {
    ack?: number;
    subscription_id?: number;
    cascade?: string[];
}
export declare class SubscriptionObjDto {
    component?: SubscriptionComponent;
    product: Partial<Product>;
    currency: string;
    current_period_ends_at: string;
    id: number;
    signup_revenue: string;
    state: string;
}
export declare class CurrentSubscriptionDto {
    id?: number;
    subscription: SubscriptionObjDto;
}
export declare class ComponentPriceDto {
    id: number;
    component_id: number;
    starting_quantity: number;
    ending_quantity: number | null;
    unit_price: string;
    price_point_id: number;
    formatted_unit_price: string;
    segment_id: number | null;
}
export declare class ComponentPriceInfoDto {
    id: number;
    default: boolean;
    name: string;
    type: string;
    pricing_scheme: string;
    component_id: number;
    handle: string;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    prices: ComponentPriceDto[];
    tax_included: boolean;
}
declare class EventSpecificData {
    previous_allocation?: number | null;
    new_allocation?: number | null;
    component_id?: number | null;
    component_handle?: string | null;
    memo?: string | null;
    allocation_id?: number | null;
    uid?: string | null;
    number?: string | null;
    role?: string | null;
    due_date?: string | null;
    issue_date?: string | null;
    paid_date?: string | null;
    due_amount?: string | null;
    paid_amount?: string | null;
    tax_amount?: string | null;
    refund_amount?: string | null;
    total_amount?: string | null;
    status_amount?: string | null;
    line_items?: LineItemsEntity[] | null;
    product_name?: string | null;
    reason?: string | null;
    service_credit_account_balance_in_cents?: number | null;
    service_credit_balance_change_in_cents?: number | null;
    currency_code?: string | null;
    at_time?: string | null;
    product_id?: number;
    account_transaction_id?: number;
}
declare class LineItemsEntity {
    uid: string;
    title: string;
    description: string;
    quantity: string;
    unit_price: string;
    period_range_start: string;
    period_range_end: string;
    amount: string;
    line_references: string;
    pricing_details_index?: number | null;
    pricing_details?: PricingDetailsEntity[] | null;
    tax_code: string;
    tax_amount: string;
    product_id: number;
    product_price_point_id: number;
    price_point_id: number;
    component_id: number;
    custom_item?: null;
}
declare class PricingDetailsEntity {
    label: string;
    amount: string;
}
export declare class SubscriptionEvent {
    id: number;
    key: string;
    message: string;
    subscription_id: number;
    customer_id: number;
    created_at: string;
    event_specific_data: EventSpecificData;
}
export declare class Events {
    event: SubscriptionEvent;
}
export {};
