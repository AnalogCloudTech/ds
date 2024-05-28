import { BookPreviewsDocument } from '../schemas/book-previews.schema';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
export declare class BookPreviewsRepository extends GenericRepository<BookPreviewsDocument> {
    protected readonly model: Model<BookPreviewsDocument>;
    constructor(model: Model<BookPreviewsDocument>);
}
