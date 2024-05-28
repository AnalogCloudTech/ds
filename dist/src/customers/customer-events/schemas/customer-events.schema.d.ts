import { HydratedDocument } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Events } from '@/customers/customer-events/domain/types';
export declare class CustomerEvent {
    customer: CustomerId | CustomerDocument;
    event: Events;
    metadata: object;
}
export type CustomerEventDocument = HydratedDocument<CustomerEvent>;
export declare const CustomerEventSchema: import("mongoose").Schema<CustomerEvent, import("mongoose").Model<CustomerEvent, any, any, any>, any, any>;
