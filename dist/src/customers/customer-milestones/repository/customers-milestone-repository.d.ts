import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { CustomerMilestoneDocument } from '../schema/customer-milestone.schema';
import { CustomerMilestonesDto } from '../domain/types';
export declare class CustomersMilestoneRepository extends GenericRepository<CustomerMilestoneDocument> {
    protected readonly model: Model<CustomerMilestoneDocument>;
    constructor(model: Model<CustomerMilestoneDocument>);
    countMilestones(): Promise<number>;
    getAllMilestones(filter: FilterQuery<CustomerMilestoneDocument>, options?: QueryOptions): Promise<CustomerMilestonesDto[]>;
}
