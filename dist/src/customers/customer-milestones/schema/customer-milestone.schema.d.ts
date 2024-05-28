import { HydratedDocument } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class CustomerMilestone {
    customer: CustomerId | CustomerDocument;
    status: string;
    dateChecked: string;
    milestoneName: string;
    value?: string;
}
export type CustomerMilestoneDocument = HydratedDocument<CustomerMilestone>;
export declare const CustomerMilestoneSchema: import("mongoose").Schema<CustomerMilestone, import("mongoose").Model<CustomerMilestone, any, any, any>, any, any>;
