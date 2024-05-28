import { Type } from '@nestjs/common';
import { ChargifyId, StripeId } from '../domain/types';
export declare class CreateProductDto {
    title: string;
    stripeId: StripeId;
    type: Type;
    chargifyComponentId: ChargifyId;
    chargifyProductHandle: ChargifyId;
    chargifyProductPriceHandle: ChargifyId;
    toShowBuyCredits: boolean;
}
