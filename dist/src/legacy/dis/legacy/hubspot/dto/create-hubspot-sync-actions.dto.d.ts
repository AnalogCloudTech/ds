import { ActionsEnum, SyncData } from '@/legacy/dis/legacy/hubspot/domain/types';
export declare class CreateHubspotSyncActionsDTO {
    data: SyncData;
    action: ActionsEnum;
    refId: string;
}
