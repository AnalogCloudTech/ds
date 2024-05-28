import { Stripe as StripeLib } from 'stripe';
import { SubscriptionProduct, OneTimeProduct } from './product.dto';
export declare class CreateSubscriptionDto {
    customerId: string;
    products: SubscriptionProduct[];
    oneTimeProducts?: OneTimeProduct[];
    trialPeriod: number;
    metadata?: any;
}
export declare class SubscriptionProrationDto {
    subscriptionId: string;
    newPriceId: string;
}
export declare class SubscriptionProrationResponse {
    amountDue: number;
    amountPaid: number;
    amountRemaining: number;
    prorationDate: string | null;
    subTotal: number;
    total: number;
    nextPaymentAttempt: string;
    subscriptionId: string;
    startingBalance: number;
    newPriceId: string;
    newPriceNickname: string;
    newPriceValue: number;
    lineItems: LineItem[];
}
export declare class LineItem {
    amount: number;
    description: string;
}
export declare class UpgradeSubscriptionDto extends SubscriptionProrationDto {
    prorationDate: string;
    paymentMethodId: string;
}
export declare class UpgradeSubscriptionResponse {
    listItems: ListItem[];
    billingCycleAnchor: string;
    currentPeriodEnd: string;
    currentPeriodStart: string;
    status: string;
    trialEnd: string;
}
export declare class ListItem {
    priceId: string;
    nickName: string;
    amount: number;
    interval: string;
    intervalCount: number;
    quantity: number;
}
export type Subscription = StripeLib.Subscription;
export declare enum ProrationBehavior {
    ALWAYS_INVOICE = "always_invoice",
    CREATE_PRORATIONS = "create_prorations",
    NONE = "none"
}
export type SubscriptionUpdateParams = StripeLib.SubscriptionUpdateParams;
