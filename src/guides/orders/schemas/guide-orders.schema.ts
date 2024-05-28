import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import {
  FrontCover,
  OrderStatus,
  Address,
} from '@/guides/orders/domain/guide-orders';
import { SchemaId } from '@/internal/types/helpers';

@Schema({
  timestamps: true,
  collection: 'ds__guide_orders',
  optimisticConcurrency: true,
})
export class GuideOrders {
  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: SchemaId | CustomerDocument;

  @Prop({ required: true })
  frontCover: FrontCover[];

  @Prop({ type: String, required: true })
  orderId: string;

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

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: String, required: true })
  guideName: string;

  @Prop({ type: String, required: false })
  guideId?: string;

  @Prop({ type: String, required: true })
  thumbnail: string;

  @Prop({ type: String, required: false })
  landingPage?: string;

  @Prop({ type: String, required: false })
  readPage?: string;

  @Prop({ enum: OrderStatus, required: false })
  status?: string;

  @Prop({ required: true })
  shippingAddress: Address;
}

export type GuideOrderDocument = HydratedDocument<GuideOrders>;
export const GuideOrdersSchema = SchemaFactory.createForClass(GuideOrders);
