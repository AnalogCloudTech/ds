import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { EmailHistory, EmailHistoryDocument } from '@/campaigns/email-campaigns/email-history/schemas/email-history.schema';
import { FilterQuery, Model } from 'mongoose';
export declare class EmailHistoryRepository extends GenericRepository<EmailHistoryDocument> {
    protected readonly model: Model<EmailHistoryDocument>;
    constructor(model: Model<EmailHistoryDocument>);
    count(filter: FilterQuery<EmailHistory>): Promise<number>;
}
