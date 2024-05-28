import { ChargifyId, HubspotPriceProperty, HubspotProductProperty, ProductId, StripeId, Type } from './types';
export declare class Product {
    id: ProductId;
    title: string;
    stripeId: StripeId;
    type: Type;
    chargifyComponentId: ChargifyId;
    chargifyProductHandle: ChargifyId;
    chargifyProductPriceHandle: ChargifyId;
    productProperty: HubspotProductProperty;
    priceProperty: HubspotPriceProperty;
    value: number;
    creditsOnce: number;
    toShowBuyCredits: number;
    creditsRecur: number;
    productWithoutTrial: boolean;
}
