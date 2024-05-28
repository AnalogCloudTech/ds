import {
  ActionsEnum,
  SyncData,
} from '@/legacy/dis/legacy/hubspot/domain/types';

export class CreateHubspotSyncActionsDTO {
  data: SyncData;
  action: ActionsEnum;
  refId: string;
}
