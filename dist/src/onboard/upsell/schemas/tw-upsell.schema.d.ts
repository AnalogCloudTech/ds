import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
export declare enum PaymentProviders {
    CHARGIFY = "CHARGIFY",
    STRIPE = "STRIPE",
    NONE = "NONE"
}
export declare enum PaymentStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    UNPAID = "UNPAID"
}
export declare class TripWireUpsell {
    customer: CustomerDocument;
    customerEmail: string;
    offer: OfferDocument;
    offerName: string;
    sessionId: SchemaId;
    paymentProvider: PaymentProviders;
    paymentStatus: PaymentStatus;
    channel?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
}
export type TWUpsellDocument = HydratedDocument<TripWireUpsell> & SchemaTimestampsConfig;
export declare const TripWireUpsellSchema: import("mongoose").Schema<TripWireUpsell, import("mongoose").Model<TripWireUpsell, any, any, any>, any, any>;
