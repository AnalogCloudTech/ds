import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CampaignHistoryType,
  CampaignId,
} from '@/campaigns/email-campaigns/campaigns/domain/types';
import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { MessageId } from 'aws-sdk/clients/ses';
import { SchemaTypes, HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'ds__emailCampaigns__campaigns_history',
})
export class CampaignHistory {
  @Prop({ required: true, ref: 'Campaign', type: SchemaTypes.ObjectId })
  campaign: CampaignId | CampaignDocument;

  @Prop({ required: true })
  templateNames: Array<string>;

  @Prop()
  messageIds: Array<MessageId>;

  @Prop({ required: true, enum: CampaignHistoryType })
  type: CampaignHistoryType;

  @Prop()
  createdAt: Date;
}

export type CampaignHistoryDocument = HydratedDocument<CampaignHistory>;
export const CampaignHistorySchema =
  SchemaFactory.createForClass(CampaignHistory);
