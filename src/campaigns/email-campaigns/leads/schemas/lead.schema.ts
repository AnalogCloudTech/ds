import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, SchemaTypes } from 'mongoose';
import {
  CustomerId,
  LastUsage,
  Segments,
} from '@/campaigns/email-campaigns/leads/domain/types';
import { Address } from '../dto/address';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Schema({ timestamps: true, collection: 'ds__emailCampaigns__leads' })
export class Lead {
  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ type: Array<number> })
  segments: Segments;

  @Prop({
    default: false,
  })
  allSegments: boolean;

  @Prop()
  bookId: string;

  @Prop({
    required: true,
  })
  customerEmail: string;

  @Prop({ required: false, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument | null;

  @Prop()
  formId: string;

  @Prop()
  pageName: string;

  @Prop()
  pageTitle: string;

  @Prop()
  domain: string;

  @Prop({ default: false })
  unsubscribed: boolean;

  @Prop({ default: true })
  isValid: boolean;

  @Prop({ required: false })
  address: Address;

  @Prop({ required: false, type: LastUsage })
  lastUsage: LastUsage;

  @Prop({ nullable: true, default: null })
  deletedAt?: Date;

  @Prop()
  createdAt: Date;
}

export type LeadDocument = HydratedDocument<Lead>;
const LeadSchema = SchemaFactory.createForClass(Lead);

LeadSchema.pre('find', function () {
  this.where({
    deletedAt: <FilterQuery<LeadDocument>>this.getQuery()['deletedAt'] ?? null,
  });
});
export { LeadSchema };
