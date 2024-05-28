import { BooksRepository } from '../repositories/books.repository';
import { CreateBookDto } from '../dto/create-book.dto';
import { Book } from '../schemas/book.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery, QueryOptions } from 'mongoose';
export declare class BooksService {
    private readonly booksRepository;
    constructor(booksRepository: BooksRepository);
    create(dto: CreateBookDto, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, Book> & Book & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    find(filter: FilterQuery<Book>, options?: QueryOptions, customer?: CustomerDocument): Promise<(import("mongoose").Document<unknown, any, Book> & Book & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(filter: FilterQuery<Book>, customer?: CustomerDocument): Promise<import("mongoose").Document<unknown, any, Book> & Book & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    delete(filter: FilterQuery<Book>, customer?: CustomerDocument): Promise<import("mongoose").Document<unknown, any, Book> & Book & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(filter: FilterQuery<Book>, dto: Partial<Book>, customer?: CustomerDocument): Promise<import("mongoose").Document<unknown, any, Book> & Book & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
