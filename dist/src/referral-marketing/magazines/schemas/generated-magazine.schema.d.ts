import mongoose, { HydratedDocument } from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { SchemaId } from '@/internal/types/helpers';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
export declare enum GenerationStatus {
    DONE = "DONE",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    ERROR = "ERROR",
    SENT_FOR_PRINTING = "SENT_FOR_PRINTING"
}
export declare class GeneratedMagazine {
    customer: mongoose.Types.ObjectId | CustomerDocument;
    magazine: mongoose.Types.ObjectId | MagazineDocument;
    url: string;
    status: string;
    active: boolean;
    additionalInformation: string;
    isPreview: boolean;
    flippingBookUrl: string;
    coverImage: string;
    pageUrl: string;
    bookUrl: string;
    pageStatus: string;
    coversOnlyUrl: string;
    createdByAutomation?: boolean;
    leadCovers: {
        lead?: SchemaId | LeadDocument;
        coversUrl?: string;
        fullContentUrl?: string;
    }[];
}
export type GeneratedMagazineDocument = HydratedDocument<GeneratedMagazine>;
export declare const GeneratedMagazineSchema: mongoose.Schema<GeneratedMagazine, mongoose.Model<GeneratedMagazine, any, any, any>, any, any>;
