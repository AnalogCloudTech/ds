import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
export declare class CampaignRepository extends GenericRepository<CampaignDocument> {
    protected readonly model: Model<CampaignDocument>;
    constructor(model: Model<CampaignDocument>);
}
