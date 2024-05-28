import { ObjectId } from 'mongoose';
export type StripeId = string;
export type ChargifyId = string;
export type ProductId = ObjectId;
export declare enum Type {
    ONE_TIME = "one_time",
    SUBSCRIPTION = "subscription"
}
export declare enum HubspotProductProperty {
    AUTHORIFY_PRODUCT = "authorify_product",
    REFERRAL_MARKETING_PRODUCT = "referral_marketing_product",
    DENTIST_PRODUCT = "dentist_product"
}
export declare enum HubspotPriceProperty {
    RECURRING_REVENUE_AMOUNT = "recurring_revenue_amount"
}
export declare const oneTimeProductFamilyHandles: string[];
