import { HubspotSyncActionsRepository } from '@/legacy/dis/legacy/hubspot/repository/hubspot-sync-actions.repository';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { SchemaId } from '@/internal/types/helpers';
import { UpdateQuery } from 'mongoose';
import { HubspotSyncActionsDocument } from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
export declare class HubspotSyncActionsServices {
    private readonly hubspotSyncActionsRepository;
    private readonly hubspotService;
    constructor(hubspotSyncActionsRepository: HubspotSyncActionsRepository, hubspotService: HubspotService);
    private create;
    update(id: SchemaId, data: UpdateQuery<HubspotSyncActionsDocument>): Promise<import("mongoose").Document<unknown, any, import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions> & import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addBookCreditsToCustomer(refId: string, credits: number): Promise<import("mongoose").Document<unknown, any, import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions> & import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    enrollContactToList(refId: string, listId: number): Promise<import("mongoose").Document<unknown, any, import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions> & import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    setBookPackages(refId: string, bookPackages: Array<string>): Promise<import("mongoose").Document<unknown, any, import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions> & import("@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema").HubspotSyncActions & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    private handleAddCredits;
    private handleEnrollContactToList;
    private handleSetBookPackages;
    handleSyncEvent(hubspotSyncActionDocument: HubspotSyncActionsDocument): Promise<void>;
}
