import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { BookCreditDocument } from './schemas/book-credits.schema';
export declare class BookCreditsRepository extends GenericRepository<BookCreditDocument> {
    protected readonly model: Model<BookCreditDocument>;
    constructor(model: Model<BookCreditDocument>);
    findAggregate(filter?: {}): Promise<Array<BookCreditDocument>>;
}
