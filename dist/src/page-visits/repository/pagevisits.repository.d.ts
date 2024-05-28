import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';
import { PageVisitsDocument } from '../schemas/pagevisits.schema';
export declare class PagevisitsRepository extends GenericRepository<PageVisitsDocument> {
    protected readonly model: Model<PageVisitsDocument>;
    constructor(model: Model<PageVisitsDocument>);
}
