import { BookPreviewsRepository } from '../repositories/book-previews.respository';
import { CreateBookPreviewsDto } from '../dto/create-book-previews.dto';
import { UpdateBookPreviewsDto } from '../dto/update-book-previews.dto';
import { FilterQuery, QueryOptions } from 'mongoose';
import { BookPreviews, BookPreviewsDocument } from '../schemas/book-previews.schema';
import { SchemaId } from '@/internal/types/helpers';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
export declare class BookPreviewsService {
    private readonly bookPreviewsRepository;
    constructor(bookPreviewsRepository: BookPreviewsRepository);
    create(dto: CreateBookPreviewsDto): Promise<BookPreviewsDocument>;
    find(filter: FilterQuery<BookPreviews>, options?: QueryOptions): Promise<PaginatorSchematicsInterface<BookPreviewsDocument>>;
    delete(id: SchemaId): Promise<BookPreviewsDocument>;
    update(id: SchemaId, dto: UpdateBookPreviewsDto): Promise<BookPreviewsDocument>;
}
