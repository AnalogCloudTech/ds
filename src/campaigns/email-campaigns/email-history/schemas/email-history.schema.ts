import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import {
  LeadHistoryStatus,
  RelationTypes,
} from '@/campaigns/email-campaigns/email-history/schemas/types';
import {
  Lead,
  LeadDocument,
} from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { EmailHistory as LeadEmailHistoryDomain } from '@/campaigns/email-campaigns/email-history/domain/email-history';
import { CastableTo } from '@/internal/common/utils';
import { OnDemandEmailDocument } from '@/campaigns/email-campaigns/on-demand-emails/schemas/on-demand-email.schema';
import { CampaignHistoryDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';

@Schema({
  timestamps: true,
  collection: 'ds__emailCampaigns__email_history',
})
export class EmailHistory extends CastableTo<LeadEmailHistoryDomain> {
  @Prop({ ref: Lead.name, type: SchemaTypes.ObjectId })
  lead: ObjectId | LeadDocument;

  @Prop({
    required: true,
    enum: LeadHistoryStatus,
    default: LeadHistoryStatus.SEND,
  })
  status: string;

  @Prop({ refPath: 'relationType', required: true, type: SchemaTypes.ObjectId })
  relationId: ObjectId | OnDemandEmailDocument | CampaignHistoryDocument;

  @Prop({ required: true, enum: RelationTypes })
  relationType: string;

  @Prop({ default: null })
  extraInfos: Array<string>;

  @Prop({ default: null, type: Object })
  rawData: object;
}

export type EmailHistoryDocument = EmailHistory & Document;
export const EmailHistorySchema = SchemaFactory.createForClass(EmailHistory);
