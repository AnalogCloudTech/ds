import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CustomerId, SubscriptionStatus } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Schema({ timestamps: true, collection: 'ds__customers_subscriptions' })
export class CustomerSubscription {
  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument;

  @Prop({ required: true, type: String, enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @Prop({ required: true })
  subscriptionId: string;
}

export type CustomerSubscriptionDocument =
  HydratedDocument<CustomerSubscription>;
export const CustomerSubscriptionSchema =
  SchemaFactory.createForClass(CustomerSubscription);
