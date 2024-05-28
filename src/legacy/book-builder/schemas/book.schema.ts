import {
  Customer,
  CustomerDocument,
} from '@/customers/customers/schemas/customer.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'ds__books',
})
export class Book {
  @Prop({ ref: Customer.name, type: SchemaTypes.ObjectId, required: true })
  customer: mongoose.Types.ObjectId | CustomerDocument;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  landingPageUrl?: string;

  @Prop({ required: false })
  digitalBookUrl?: string;

  @Prop({ required: false })
  customLandingPageUrl?: string;
}

export type BookDocument = HydratedDocument<Book>;
export const BookSchema = SchemaFactory.createForClass(Book);
