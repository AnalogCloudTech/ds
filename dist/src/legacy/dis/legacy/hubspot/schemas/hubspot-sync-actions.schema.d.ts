import { HydratedDocument } from 'mongoose';
import { ActionsEnum, StatusEnum, SyncData } from '@/legacy/dis/legacy/hubspot/domain/types';
export declare class HubspotSyncActions {
    action: ActionsEnum;
    data: SyncData;
    refId: string;
    status: StatusEnum;
    attempts: number;
    syncResult: Array<string>;
}
export type HubspotSyncActionsDocument = HydratedDocument<HubspotSyncActions>;
export declare const HubspotSyncActionsSchema: import("mongoose").Schema<HubspotSyncActions, import("mongoose").Model<HubspotSyncActions, any, any, any>, any, any>;
