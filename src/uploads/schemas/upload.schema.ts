import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from '@/customers/customers/schemas/customer.schema';

@Schema({ timestamps: true, collection: 'ds__uploads' })
export class Upload {
  @Prop({ required: true })
  bucket: string;

  @Prop({ required: true })
  ext: string;

  @Prop({ ref: Customer.name, type: SchemaTypes.ObjectId })
  customer: ObjectId | CustomerDocument;

  @Prop({ default: '' })
  downloadUrl: string;

  @Prop({ required: true })
  uploadUrl: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop()
  context?: string;
}

export type UploadDocument = Upload & Document;
export const UploadSchema = SchemaFactory.createForClass(Upload);
