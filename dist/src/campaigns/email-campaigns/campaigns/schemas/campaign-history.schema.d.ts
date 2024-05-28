import { CampaignHistoryType, CampaignId } from '@/campaigns/email-campaigns/campaigns/domain/types';
import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { MessageId } from 'aws-sdk/clients/ses';
import { HydratedDocument } from 'mongoose';
export declare class CampaignHistory {
    campaign: CampaignId | CampaignDocument;
    templateNames: Array<string>;
    messageIds: Array<MessageId>;
    type: CampaignHistoryType;
    createdAt: Date;
}
export type CampaignHistoryDocument = HydratedDocument<CampaignHistory>;
export declare const CampaignHistorySchema: import("mongoose").Schema<CampaignHistory, import("mongoose").Model<CampaignHistory, any, any, any>, any, any>;
