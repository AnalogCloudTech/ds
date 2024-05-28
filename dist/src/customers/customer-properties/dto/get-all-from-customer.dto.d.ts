import { FilterQuery } from 'mongoose';
import { CustomerPropertiesDocument } from '@/customers/customer-properties/schemas/customer-properties.schemas';
export declare class GetAllFromCustomerDto {
    filter?: FilterQuery<CustomerPropertiesDocument>;
}
