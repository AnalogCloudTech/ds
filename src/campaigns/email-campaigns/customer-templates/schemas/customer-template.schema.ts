import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CustomerType } from '@/campaigns/email-campaigns/customer-templates/domain/types';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';

@Schema({
  timestamps: true,
  collection: 'ds__emailCampaigns_customer_templates',
})
export class CustomerTemplate {
  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerType;

  @Prop()
  templateId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  bodyContent?: string;

  @Prop()
  templateTitle?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ default: null })
  @Type(() => Date)
  deletedAt: Date;
}

export type CustomerTemplateDocument = HydratedDocument<CustomerTemplate>;
export const CustomerTemplateSchema =
  SchemaFactory.createForClass(CustomerTemplate);
