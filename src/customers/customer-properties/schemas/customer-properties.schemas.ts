import {
  Customer,
  CustomerDocument,
} from '@/customers/customers/schemas/customer.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import {
  Version,
  Versions,
} from '@/customers/customer-properties/domain/types';

@Schema({
  timestamps: true,
  collection: 'ds__customer_properties',
})
export class CustomerProperties {
  @Prop({ ref: Customer.name, type: SchemaTypes.ObjectId, required: true })
  customer: SchemaId | CustomerDocument;

  @Prop({ required: true })
  module: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ required: true, default: '' })
  value: string;

  @Prop({ type: Array<Version> })
  versions: Versions;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({
    required: true,
    ref: Customer.name,
    type: SchemaTypes.String,
    default: null,
  })
  createdBy: SchemaId | CustomerDocument;

  @Prop({ required: false, ref: Customer.name, type: SchemaTypes.ObjectId })
  updatedBy: SchemaId | CustomerDocument | null;

  @Prop({ required: true })
  customerEmail: string;

  @Prop({ type: Object, default: {} })
  metadata: object;
}

export type CustomerPropertiesDocument = HydratedDocument<CustomerProperties>;
export const CustomerPropertiesSchema =
  SchemaFactory.createForClass(CustomerProperties);
