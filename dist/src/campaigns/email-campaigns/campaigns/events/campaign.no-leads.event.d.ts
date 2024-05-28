import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { EventContract } from '@/campaigns/email-campaigns/campaigns/events/event.contract';
export declare class CampaignNoLeadsEvent implements EventContract {
    campaign: CampaignDocument;
    message: 'no-leads';
    constructor(campaign: CampaignDocument);
}
