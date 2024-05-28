import { InjectModel } from '@nestjs/mongoose';
import {
  BookPreviewsDocument,
  BookPreviews,
} from '../schemas/book-previews.schema';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';

export class BookPreviewsRepository extends GenericRepository<BookPreviewsDocument> {
  constructor(
    @InjectModel(BookPreviews.name)
    protected readonly model: Model<BookPreviewsDocument>,
  ) {
    super(model);
  }
}
