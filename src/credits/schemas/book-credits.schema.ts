import { SchemaId } from '@/internal/types/helpers';
import {
  ProductDocument,
  Product,
} from '@/onboard/products/schemas/product.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { CreditType } from '@/credits/domain/book-credits';

@Schema({ timestamps: true, collection: 'ds__onboard__book_credits' })
export class BookCreditsOption {
  @Prop({ required: true })
  credits: number;

  @Prop({ required: true })
  perAmount: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ required: false, enum: CreditType })
  type?: CreditType;

  @Prop({ ref: Product.name, type: SchemaTypes.ObjectId, required: true })
  productId: SchemaId | ProductDocument;

  @Prop({ required: false, Type: String })
  savings?: string;
}

export type BookCreditDocument = HydratedDocument<BookCreditsOption>;
export const BookCreditSchema = SchemaFactory.createForClass(BookCreditsOption);
