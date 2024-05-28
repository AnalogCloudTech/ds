import { CampaignNoLeadsEvent } from '@/campaigns/email-campaigns/campaigns/events/campaign.no-leads.event';
import { CampaignNoEmailsEvent } from '@/campaigns/email-campaigns/campaigns/events/campaign.no-emails.event';
export declare enum CampaignEvents {
    NO_LEADS = "no-leads",
    NO_EMAILS = "no-emails"
}
export declare class CampaignListeners {
    handleCampaignNoLeads(event: CampaignNoLeadsEvent): Promise<void>;
    handleCampaignNoEmails(event: CampaignNoEmailsEvent): Promise<void>;
}
