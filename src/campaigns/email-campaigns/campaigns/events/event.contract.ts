import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';

export interface EventContract {
  campaign: CampaignDocument;
  message: string;
}
