import { PaymentProfiles, Subscription } from '@/payments/chargify/domain/types';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { Allocation } from '@/payments/payment_chargify/dto/components.dto';
export declare class UpgradePlanDto {
    planComponentHandle: string;
    paymentProfileId: string;
    flow: string;
    isPlusPlan?: boolean;
}
export declare class ResponseUpgradePlanDto {
    result: Allocation;
    subscriptionData: Subscription;
    paymentProfile: PaymentProfiles;
    productData: ProductDocument;
}
export declare class ResponseInterDto {
    interval: string;
    interval_unit: string;
}
export interface IntervalInterface {
    interval: string;
    interval_unit: string;
}
