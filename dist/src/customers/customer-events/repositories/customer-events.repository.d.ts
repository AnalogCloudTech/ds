import { Model } from 'mongoose';
import { CustomerEventDocument } from '@/customers/customer-events/schemas/customer-events.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
export declare class CustomerEventsRepository extends GenericRepository<CustomerEventDocument> {
    protected readonly model: Model<CustomerEventDocument>;
    constructor(model: Model<CustomerEventDocument>);
}
