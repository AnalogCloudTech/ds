import { Versions } from '@/customers/customer-properties/domain/types';
import { Customer as CustomerDomain } from '@/customers/customers/domain/customer';
export declare class CustomerProperties {
    id: string;
    customer: CustomerDomain;
    module: string;
    name: string;
    value: string;
    versions: Versions;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
