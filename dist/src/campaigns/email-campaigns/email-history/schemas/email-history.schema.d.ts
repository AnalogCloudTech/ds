import { Document, ObjectId } from 'mongoose';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { EmailHistory as LeadEmailHistoryDomain } from '@/campaigns/email-campaigns/email-history/domain/email-history';
import { CastableTo } from '@/internal/common/utils';
import { OnDemandEmailDocument } from '@/campaigns/email-campaigns/on-demand-emails/schemas/on-demand-email.schema';
import { CampaignHistoryDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';
export declare class EmailHistory extends CastableTo<LeadEmailHistoryDomain> {
    lead: ObjectId | LeadDocument;
    status: string;
    relationId: ObjectId | OnDemandEmailDocument | CampaignHistoryDocument;
    relationType: string;
    extraInfos: Array<string>;
    rawData: object;
}
export type EmailHistoryDocument = EmailHistory & Document;
export declare const EmailHistorySchema: import("mongoose").Schema<EmailHistory, import("mongoose").Model<EmailHistory, any, any, any>, any, any>;
