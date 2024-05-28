import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import {
  BookCreditDocument,
  BookCreditsOption,
} from './schemas/book-credits.schema';

@Injectable()
export class BookCreditsRepository extends GenericRepository<BookCreditDocument> {
  constructor(
    @InjectModel(BookCreditsOption.name)
    protected readonly model: Model<BookCreditDocument>,
  ) {
    super(model);
  }
  async findAggregate(filter = {}): Promise<Array<BookCreditDocument>> {
    const bookCredits = await this.model
      .aggregate<BookCreditDocument>([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: 'ds__products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: {
            path: '$product',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { credits: -1 },
        },
      ])
      .exec();
    return bookCredits;
  }
}
