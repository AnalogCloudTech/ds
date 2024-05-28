import { SchemaId } from '@/internal/types/helpers';
import { PaymentProviders, PaymentStatus } from '@/onboard/upsell/schemas/tw-upsell.schema';
export declare class CreateUpsellReportDto {
    customer: object;
    customerEmail: string;
    offer: object;
    offerName: string;
    paymentProvider: PaymentProviders;
    paymentStatus: PaymentStatus;
    sessionId: SchemaId;
    channel?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
}
