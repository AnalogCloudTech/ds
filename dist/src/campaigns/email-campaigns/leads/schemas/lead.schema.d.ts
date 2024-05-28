import { HydratedDocument } from 'mongoose';
import { CustomerId, LastUsage, Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { Address } from '../dto/address';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class Lead {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    segments: Segments;
    allSegments: boolean;
    bookId: string;
    customerEmail: string;
    customer: CustomerId | CustomerDocument | null;
    formId: string;
    pageName: string;
    pageTitle: string;
    domain: string;
    unsubscribed: boolean;
    isValid: boolean;
    address: Address;
    lastUsage: LastUsage;
    deletedAt?: Date;
    createdAt: Date;
}
export type LeadDocument = HydratedDocument<Lead>;
declare const LeadSchema: import("mongoose").Schema<Lead, import("mongoose").Model<Lead, any, any, any>, any, any>;
export { LeadSchema };
