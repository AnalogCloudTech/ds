import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'ds__book_previews',
})
export class BookPreviews {
  @Prop({ required: true, unique: true })
  bookId: string;

  @Prop({ required: true })
  bookTitle: string;

  @Prop({ required: true })
  pdfUrl: string;
}

export type BookPreviewsDocument = HydratedDocument<BookPreviews>;
export const BookPreviewsSchema = SchemaFactory.createForClass(BookPreviews);
