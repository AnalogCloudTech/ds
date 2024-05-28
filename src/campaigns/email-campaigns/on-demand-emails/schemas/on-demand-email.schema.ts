import { Segments } from '@/campaigns/email-campaigns/leads/domain/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Statuses } from '../domain/types';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MessageId } from 'aws-sdk/clients/ses';

@Schema({
  timestamps: true,
  collection: 'ds__emailCampaigns__on_demand_emails',
})
export class OnDemandEmail {
  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  templateId: number;

  @Prop({ required: true })
  templateName: string;

  @Prop()
  segments: Segments;

  @Prop({ default: false })
  allSegments: boolean;

  @Prop({ default: Statuses.STATUS_SCHEDULED })
  status: string;

  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument;

  @Prop({ default: false })
  sendImmediately: boolean;

  @Prop({ default: null })
  @Type(() => Date)
  scheduleDate: Date;

  @Prop({ default: null })
  @Type(() => Date)
  completionDate: Date;

  @Prop({ required: true })
  timezone: string;

  @Prop()
  messageIds: MessageId[];
}

export type OnDemandEmailDocument = HydratedDocument<OnDemandEmail>;
export const OnDemandEmailSchema = SchemaFactory.createForClass(OnDemandEmail);
