import { Document } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class Attribute {
    mediaType: string;
    pageAddress: string;
    securityKey: string;
    secretKey: string;
    customerId: CustomerId | CustomerDocument;
}
export type AttributesDocument = Attribute & Document;
export declare const AttributeSchema: import("mongoose").Schema<Attribute, import("mongoose").Model<Attribute, any, any, any>, any, any>;
