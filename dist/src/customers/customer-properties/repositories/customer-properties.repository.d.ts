import { CustomerPropertiesDocument } from '@/customers/customer-properties/schemas/customer-properties.schemas';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
export declare class CustomerPropertiesRepository extends GenericRepository<CustomerPropertiesDocument> {
    protected readonly model: Model<CustomerPropertiesDocument>;
    constructor(model: Model<CustomerPropertiesDocument>);
}
