import { CastableTo } from '@/internal/common/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BookOption as DomainBookOption } from '../domain/book-option';
import { BookOptionImageUrl } from '../domain/types';

@Schema({ timestamps: true, collection: 'ds__onboard__book_options' })
export class BookOption extends CastableTo<DomainBookOption> {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  templateId: string;

  @Prop({ type: String, required: true })
  image: BookOptionImageUrl;
}

export type BookOptionDocument = BookOption & Document;
export const BookOptionSchema = SchemaFactory.createForClass(BookOption);
