import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Events } from '@/customers/customer-events/domain/types';

@Schema({ timestamps: true, collection: 'ds__customer_events' })
export class CustomerEvent {
  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customer: CustomerId | CustomerDocument;

  @Prop({ required: true, enum: Events, type: String })
  event: Events;

  @Prop({ type: Object, default: null })
  metadata: object;
}

export type CustomerEventDocument = HydratedDocument<CustomerEvent>;
export const CustomerEventSchema = SchemaFactory.createForClass(CustomerEvent);
