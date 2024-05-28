/// <reference types="mongoose" />
import { BookPreviewsService } from '../services/book-previews.service';
import { CreateBookPreviewsDto } from '../dto/create-book-previews.dto';
import { Paginator } from '@/internal/utils/paginator';
import { BookPreviewsDocument } from '@/legacy/book-builder/schemas/book-previews.schema';
import { SchemaId } from '@/internal/types/helpers';
import { UpdateBookPreviewsDto } from '@/legacy/book-builder/dto/update-book-previews.dto';
export declare class BookPreviewsController {
    private readonly bookPreviewsService;
    constructor(bookPreviewsService: BookPreviewsService);
    create(dto: CreateBookPreviewsDto): Promise<BookPreviewsDocument>;
    findAll({ page, perPage }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("@/legacy/book-builder/schemas/book-previews.schema").BookPreviews> & import("@/legacy/book-builder/schemas/book-previews.schema").BookPreviews & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    delete(id: SchemaId): Promise<import("mongoose").Document<unknown, any, import("@/legacy/book-builder/schemas/book-previews.schema").BookPreviews> & import("@/legacy/book-builder/schemas/book-previews.schema").BookPreviews & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: SchemaId, dto: UpdateBookPreviewsDto): Promise<import("mongoose").Document<unknown, any, import("@/legacy/book-builder/schemas/book-previews.schema").BookPreviews> & import("@/legacy/book-builder/schemas/book-previews.schema").BookPreviews & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
