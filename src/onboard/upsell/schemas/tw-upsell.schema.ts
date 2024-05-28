import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  SchemaTimestampsConfig,
  SchemaTypes,
} from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { OfferDocument } from '@/onboard/schemas/offer.schema';

export enum PaymentProviders {
  CHARGIFY = 'CHARGIFY',
  STRIPE = 'STRIPE',
  NONE = 'NONE',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNPAID = 'UNPAID',
}

@Schema({ timestamps: true, collection: 'ds__tw_upsell' })
export class TripWireUpsell {
  @Prop({ type: String, required: false })
  firstName: string;

  @Prop({ type: String, required: false })
  lastName: string;

  @Prop({ ref: 'Customer', type: Object, required: false })
  customer: CustomerDocument;

  @Prop({ type: String })
  customerEmail: string;

  @Prop({ ref: 'Offer', type: Object, required: false })
  offer: OfferDocument;

  @Prop({ type: String })
  offerName: string;

  @Prop({ type: SchemaTypes.ObjectId, required: false })
  sessionId: SchemaId;

  @Prop({ enum: PaymentProviders, default: PaymentProviders.NONE })
  paymentProvider: PaymentProviders;

  @Prop({ type: String, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Prop({ type: String, required: false })
  channel?: string;

  @Prop({ type: String, required: false })
  utmSource?: string;

  @Prop({ type: String, required: false })
  utmMedium?: string;

  @Prop({ type: String, required: false })
  utmContent?: string;

  @Prop({ type: String, required: false })
  utmTerm?: string;
}

export type TWUpsellDocument = HydratedDocument<TripWireUpsell> &
  SchemaTimestampsConfig;

export const TripWireUpsellSchema =
  SchemaFactory.createForClass(TripWireUpsell);
