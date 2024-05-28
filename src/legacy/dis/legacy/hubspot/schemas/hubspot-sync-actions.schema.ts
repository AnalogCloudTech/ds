import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  ActionsEnum,
  STATUS,
  StatusEnum,
  SyncData,
} from '@/legacy/dis/legacy/hubspot/domain/types';

@Schema({ timestamps: true, collection: 'ds__hubspot_sync_actions' })
export class HubspotSyncActions {
  @Prop({ required: true, type: String })
  action: ActionsEnum;

  @Prop({ required: true, type: Object })
  data: SyncData;

  @Prop({ required: true })
  refId: string;

  @Prop({ required: true, type: String, default: STATUS.PENDING })
  status: StatusEnum;

  @Prop({ default: 0 })
  attempts: number;

  @Prop({ default: null, type: Array<string> })
  syncResult: Array<string>;
}

export type HubspotSyncActionsDocument = HydratedDocument<HubspotSyncActions>;
export const HubspotSyncActionsSchema =
  SchemaFactory.createForClass(HubspotSyncActions);
