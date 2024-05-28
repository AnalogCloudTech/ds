import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  SchemaTimestampsConfig,
  SchemaTypes,
} from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { SchemaId } from '@/internal/types/helpers';

export class FrontCover {
  image: string;
  name: string;
  title: string;
}

export class Address {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

@Schema({
  timestamps: true,
  collection: 'ds__guide_onboard_details',
})
export class GuideDetails {
  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: SchemaId | CustomerDocument;

  @Prop({ required: true })
  frontCover: FrontCover[];

  @Prop({ type: String, required: true })
  practiceName: string;

  @Prop({ required: true })
  practiceAddress: Address;

  @Prop({ type: String, required: true })
  practicePhone: string;

  @Prop({ type: String, required: false })
  practiceEmail?: string;

  @Prop({ type: String, required: true })
  practiceLogo: string;

  @Prop({ type: String, required: false })
  practiceWebsite?: string;

  @Prop({ required: true })
  shippingAddress: Address;
}

export type GuideDetailDocument = SchemaTimestampsConfig &
  HydratedDocument<GuideDetails>;
export const GuideDetailsSchema = SchemaFactory.createForClass(GuideDetails);
