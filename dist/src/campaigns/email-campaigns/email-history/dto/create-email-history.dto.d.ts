import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { OnDemandEmailDocument } from '@/campaigns/email-campaigns/on-demand-emails/schemas/on-demand-email.schema';
import { ObjectId } from 'mongoose';
import { LeadHistoryStatus, RelationTypes } from '../schemas/types';
export declare class CreateEmailHistoryDto {
    lead: ObjectId | LeadDocument;
    status: LeadHistoryStatus;
    sentDate: string;
    relationId: ObjectId | OnDemandEmailDocument | CampaignDocument;
    relationType: RelationTypes;
}
