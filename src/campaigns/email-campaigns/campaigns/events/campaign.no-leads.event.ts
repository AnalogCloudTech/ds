import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { EventContract } from '@/campaigns/email-campaigns/campaigns/events/event.contract';

export class CampaignNoLeadsEvent implements EventContract {
  public message: 'no-leads';

  constructor(public campaign: CampaignDocument) {}
}
