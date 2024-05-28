import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CampaignNoLeadsEvent } from '@/campaigns/email-campaigns/campaigns/events/campaign.no-leads.event';
import { CampaignWithoutAvailableLeadsException } from '@/campaigns/email-campaigns/campaigns/Exceptions/campaign-without-available-leads.exception';
import { CampaignWithoutAvailableEmailsException } from '@/campaigns/email-campaigns/campaigns/Exceptions/campaign-without-available-emails.exception';
import { CampaignNoEmailsEvent } from '@/campaigns/email-campaigns/campaigns/events/campaign.no-emails.event';

export enum CampaignEvents {
  NO_LEADS = 'no-leads',
  NO_EMAILS = 'no-emails',
}

@Injectable()
export class CampaignListeners {
  @OnEvent(CampaignEvents.NO_LEADS)
  handleCampaignNoLeads(event: CampaignNoLeadsEvent): Promise<void> {
    console.info(`Campaign ${event.campaign._id} has no leads`);
    throw new CampaignWithoutAvailableLeadsException();
  }

  @OnEvent(CampaignEvents.NO_EMAILS)
  handleCampaignNoEmails(event: CampaignNoEmailsEvent): Promise<void> {
    console.info(`Campaign ${event.campaign._id} has no emails`);
    throw new CampaignWithoutAvailableEmailsException();
  }
}
