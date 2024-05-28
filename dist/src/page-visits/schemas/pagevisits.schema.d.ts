import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { HydratedDocument } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
export declare class Pagevisits {
    customerName: string;
    customerEmail: string;
    application: string;
    domain: string;
    customer: CustomerId | CustomerDocument;
    customDomain: string;
    appSection: string;
    appAction: string;
    usageDate: string;
    usageCount: number;
    read: number;
    landing: number;
    leads: number;
    pageName: string;
    userAgent: string;
    remoteHost: string;
    createdAt: Date;
}
export type PageVisitsDocument = HydratedDocument<Pagevisits>;
export declare const PagevisitsSchema: import("mongoose").Schema<Pagevisits, import("mongoose").Model<Pagevisits, any, any, any>, any, any>;
