import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { HubspotSyncActionsDocument } from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
import { Model } from 'mongoose';
export declare class HubspotSyncActionsRepository extends GenericRepository<HubspotSyncActionsDocument> {
    protected readonly model: Model<HubspotSyncActionsDocument>;
    constructor(model: Model<HubspotSyncActionsDocument>);
}
