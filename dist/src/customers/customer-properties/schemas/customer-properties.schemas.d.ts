import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { HydratedDocument } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import { Versions } from '@/customers/customer-properties/domain/types';
export declare class CustomerProperties {
    customer: SchemaId | CustomerDocument;
    module: string;
    name: string;
    deletedAt: Date;
    value: string;
    versions: Versions;
    createdAt: Date;
    updatedAt: Date;
    createdBy: SchemaId | CustomerDocument;
    updatedBy: SchemaId | CustomerDocument | null;
    customerEmail: string;
    metadata: object;
}
export type CustomerPropertiesDocument = HydratedDocument<CustomerProperties>;
export declare const CustomerPropertiesSchema: import("mongoose").Schema<CustomerProperties, import("mongoose").Model<CustomerProperties, any, any, any>, any, any>;
