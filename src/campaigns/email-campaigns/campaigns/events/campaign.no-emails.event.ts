import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { EventContract } from '@/campaigns/email-campaigns/campaigns/events/event.contract';

export class CampaignNoEmailsEvent implements EventContract {
  public message: 'no-emails';

  constructor(public campaign: CampaignDocument) {}
}
