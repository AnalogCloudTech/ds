import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
@Schema({ timestamps: true, collection: 'ds__pagevisits' })
export class Pagevisits {
  @Prop()
  customerName: string;

  @Prop({
    required: true,
  })
  customerEmail: string;

  @Prop({
    required: true,
  })
  application: string;

  @Prop({
    required: true,
  })
  domain: string;

  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument;

  @Prop()
  customDomain: string;

  @Prop()
  appSection: string;

  @Prop()
  appAction: string;

  @Prop()
  usageDate: string;

  @Prop()
  usageCount: number;

  @Prop()
  read: number;

  @Prop()
  landing: number;

  @Prop()
  leads: number;

  @Prop()
  pageName: string;

  @Prop()
  userAgent: string;

  @Prop()
  remoteHost: string;

  @Prop()
  createdAt: Date;
}

export type PageVisitsDocument = HydratedDocument<Pagevisits>;
export const PagevisitsSchema = SchemaFactory.createForClass(Pagevisits);
