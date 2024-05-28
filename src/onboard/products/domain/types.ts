import { ObjectId } from 'mongoose';

export type StripeId = string;

export type ChargifyId = string;

export type ProductId = ObjectId;

export enum Type {
  ONE_TIME = 'one_time',
  SUBSCRIPTION = 'subscription',
}

export enum HubspotProductProperty {
  AUTHORIFY_PRODUCT = 'authorify_product',
  REFERRAL_MARKETING_PRODUCT = 'referral_marketing_product',
  DENTIST_PRODUCT = 'dentist_product',
}

export enum HubspotPriceProperty {
  RECURRING_REVENUE_AMOUNT = 'recurring_revenue_amount',
}

export const oneTimeProductFamilyHandles = [
  'click_funnel_family',
  'book_credits_family',
  'guide_credits_family',
  'dentistguide',
  'holiday_sale_credits',
];
