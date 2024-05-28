import { Stripe as StripeLib } from 'stripe';
export declare enum Status {
    ACTIVE = "active"
}
export declare class Card {
    brand: string;
    country: string;
    expMonth: number;
    expYear: number;
    last4: string;
    default: boolean;
    email: string;
    id: string;
}
export type ListPaymentMethodsParams = StripeLib.PaymentMethodListParams;
export type PaymentMethod = StripeLib.PaymentMethod;
export type PaymentMethodTypes = StripeLib.PaymentMethodListParams.Type;
