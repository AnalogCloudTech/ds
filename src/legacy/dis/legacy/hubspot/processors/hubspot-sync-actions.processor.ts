import { HubspotSyncActionsServices } from '@/legacy/dis/legacy/hubspot/hubspot-sync-actions.services';
import { Process, Processor } from '@nestjs/bull';
import { HUBSPOT_SYNC_ACTIONS_QUEUE } from '@/legacy/dis/legacy/hubspot/constants';
import { HubspotSyncActionsDocument } from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
import { Job } from 'bull';

@Processor(HUBSPOT_SYNC_ACTIONS_QUEUE)
export class HubspotSyncActionsProcessor {
  constructor(
    private readonly hubspotSyncActionsServices: HubspotSyncActionsServices,
  ) {}

  @Process({ concurrency: 1 })
  async handleJob(job: Job<HubspotSyncActionsDocument>) {
    await this.hubspotSyncActionsServices.handleSyncEvent(job.data);
  }
}
