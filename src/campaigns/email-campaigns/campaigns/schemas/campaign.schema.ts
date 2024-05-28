import { CastableTo } from '@/internal/common/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CampaignStatus,
  ContentId,
  Segments,
  TemplateId,
} from '../domain/types';
import { Campaign as DomainCampaign } from '../domain/campaign';
import {
  HydratedDocument,
  SchemaTypes,
  SchemaTimestampsConfig,
} from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MessageId } from 'aws-sdk/clients/ses';

@Schema({ timestamps: true, collection: 'ds__emailCampaigns__campaigns' })
export class Campaign extends CastableTo<DomainCampaign> {
  @Prop({ required: true })
  name: string;

  @Prop()
  segments: Segments;

  @Prop()
  allowWeekend: boolean;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ default: CampaignStatus.DRAFT })
  status: CampaignStatus;

  @Prop()
  allSegments: boolean;

  @Prop({ required: true })
  contentId: ContentId;
  content: object;

  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument;

  @Prop()
  messageIds: MessageId[];

  @Prop()
  templateIds: TemplateId[];
}

export type CampaignDocument = HydratedDocument<Campaign> &
  SchemaTimestampsConfig;
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
