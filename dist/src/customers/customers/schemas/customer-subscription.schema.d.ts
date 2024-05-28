import { HydratedDocument } from 'mongoose';
import { CustomerId, SubscriptionStatus } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class CustomerSubscription {
    customer: CustomerId | CustomerDocument;
    status: SubscriptionStatus;
    subscriptionId: string;
}
export type CustomerSubscriptionDocument = HydratedDocument<CustomerSubscription>;
export declare const CustomerSubscriptionSchema: import("mongoose").Schema<CustomerSubscription, import("mongoose").Model<CustomerSubscription, any, any, any>, any, any>;
