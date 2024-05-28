import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { SmsCampaignDocument } from '@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema';
export declare class SmsCampaignRepository extends GenericRepository<SmsCampaignDocument> {
    protected readonly model: Model<SmsCampaignDocument>;
    constructor(model: Model<SmsCampaignDocument>);
}
