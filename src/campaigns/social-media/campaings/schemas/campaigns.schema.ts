import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { CastableTo } from '@/internal/common/utils';
import { CampaignDomain } from '../domain/campaigns.domain';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerId } from '@/customers/customers/domain/types';
import { CampaignStatus } from '../domain/type';

@Schema({ timestamps: true, collection: 'ds__sm_campaigns' })
export class Campaigns extends CastableTo<CampaignDomain> {
  @Prop({ required: true })
  campaignName: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true, enum: CampaignStatus })
  status: string;

  @Prop({ required: true })
  contenId: number;

  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customerId: CustomerId | CustomerDocument;
}

export type CampaignsDocument = Campaigns & Document;
export const CampaignsSchema = SchemaFactory.createForClass(Campaigns);
