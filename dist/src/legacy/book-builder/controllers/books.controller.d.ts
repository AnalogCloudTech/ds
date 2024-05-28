/// <reference types="mongoose" />
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Paginator } from '@/internal/utils/paginator';
import { CreateBookDto } from '../dto/create-book.dto';
import { BookDocument } from '../schemas/book.schema';
import { BooksService } from '../services/books.service';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(dto: CreateBookDto, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/book.schema").Book> & import("../schemas/book.schema").Book & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(customer: CustomerDocument, { page, perPage }: Paginator): Promise<(import("mongoose").Document<unknown, any, import("../schemas/book.schema").Book> & import("../schemas/book.schema").Book & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    delete(id: string, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/book.schema").Book> & import("../schemas/book.schema").Book & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, dto: Partial<BookDocument>, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/book.schema").Book> & import("../schemas/book.schema").Book & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
