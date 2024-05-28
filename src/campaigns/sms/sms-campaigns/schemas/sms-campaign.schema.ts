import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Statuses } from '@/campaigns/sms/sms-campaigns/domain/types';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Type } from 'class-transformer';
import { MessageId } from 'aws-sdk/clients/ses';

@Schema({
  collection: 'ds__sms_campaigns',
  timestamps: true,
})
export class SmsCampaign {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, maxlength: 160 })
  text: string;

  @Prop({ required: true })
  templateId: number;

  @Prop()
  segments: Array<number>;

  @Prop({ default: false })
  allSegments: boolean;

  @Prop({ enum: Statuses, default: Statuses.STATUS_SCHEDULED })
  status: string;

  @Prop({ required: true })
  @Type(() => Date)
  scheduleDate: Date;

  @Prop()
  messageIds: Array<MessageId>;

  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument;

  @Prop()
  createdAt: Date;

  // will be implemented on part 2 and 3
  // @Prop({ required: true, ref: 'CustomerPhoneNumber', type: SchemaTypes.ObjectId })
  // customerNumber: SchemaId | CustomerPhoneNumberDocument;
}

export type SmsCampaignDocument = HydratedDocument<SmsCampaign>;
export const SmsCampaignSchema = SchemaFactory.createForClass(SmsCampaign);
