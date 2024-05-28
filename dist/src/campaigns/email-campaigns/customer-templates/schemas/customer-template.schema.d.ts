import { CustomerType } from '@/campaigns/email-campaigns/customer-templates/domain/types';
import { HydratedDocument } from 'mongoose';
export declare class CustomerTemplate {
    customer: CustomerType;
    templateId: number;
    name: string;
    content: string;
    bodyContent?: string;
    templateTitle?: string;
    imageUrl?: string;
    subject: string;
    deletedAt: Date;
}
export type CustomerTemplateDocument = HydratedDocument<CustomerTemplate>;
export declare const CustomerTemplateSchema: import("mongoose").Schema<CustomerTemplate, import("mongoose").Model<CustomerTemplate, any, any, any>, any, any>;
