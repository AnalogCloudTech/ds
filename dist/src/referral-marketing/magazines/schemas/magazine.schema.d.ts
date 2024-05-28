import mongoose, { HydratedDocument } from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Cover, MagazineContent, Replacer, Selection } from '@/referral-marketing/magazines/domain/types';
export declare enum MagazineStatus {
    EDITING = "EDITING",
    MAGAZINE_GENERATED = "MAGAZINE_GENERATED",
    SENT_FOR_PRINTING = "SENT_FOR_PRINTING"
}
export declare class Magazine {
    customer: CustomerDocument | mongoose.Types.ObjectId;
    month: string;
    year: string;
    selections: Selection[];
    magazineContent: MagazineContent;
    covers: Cover[];
    magazineId: number;
    baseReplacers: Replacer[];
    status: string;
    contentUrl: string;
    createdByAutomation?: boolean;
}
export type MagazineDocument = HydratedDocument<Magazine>;
export declare const MagazineSchema: mongoose.Schema<Magazine, mongoose.Model<Magazine, any, any, any>, any, any>;
