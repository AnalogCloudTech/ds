import { HubspotSyncActionsServices } from '@/legacy/dis/legacy/hubspot/hubspot-sync-actions.services';
import { HubspotSyncActionsDocument } from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
import { Job } from 'bull';
export declare class HubspotSyncActionsProcessor {
    private readonly hubspotSyncActionsServices;
    constructor(hubspotSyncActionsServices: HubspotSyncActionsServices);
    handleJob(job: Job<HubspotSyncActionsDocument>): Promise<void>;
}
