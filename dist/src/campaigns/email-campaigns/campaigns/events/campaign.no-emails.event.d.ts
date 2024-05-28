import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { EventContract } from '@/campaigns/email-campaigns/campaigns/events/event.contract';
export declare class CampaignNoEmailsEvent implements EventContract {
    campaign: CampaignDocument;
    message: 'no-emails';
    constructor(campaign: CampaignDocument);
}
