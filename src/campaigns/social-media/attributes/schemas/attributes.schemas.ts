import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { MediaType } from '../domain/type';
import { CustomerId } from '@/customers/customers/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';

@Schema({ timestamps: true, collection: 'ds__sm_attributes' })
export class Attribute {
  @Prop({ required: true, enum: MediaType })
  mediaType: string;

  @Prop({ required: true })
  pageAddress: string;

  @Prop({ required: true })
  securityKey: string;

  @Prop({ required: true })
  secretKey: string;

  @Prop({ required: true, ref: 'Customer', type: SchemaTypes.ObjectId })
  customerId: CustomerId | CustomerDocument;
}

export type AttributesDocument = Attribute & Document;
export const AttributeSchema = SchemaFactory.createForClass(Attribute);
