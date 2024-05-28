import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { CreateBookDto } from '../dto/create-book.dto';
import { Book, BookDocument } from '../schemas/book.schema';
export type CreateBookDtoWithCustomer = CreateBookDto & {
    customer: Types.ObjectId;
};
export declare class BooksRepository {
    private readonly model;
    constructor(model: Model<BookDocument>);
    create(dto: CreateBookDtoWithCustomer): Promise<BookDocument>;
    find(filter: FilterQuery<Book>, options?: QueryOptions): Promise<BookDocument[]>;
    findOne(filter: FilterQuery<Book>, options?: QueryOptions): Promise<BookDocument>;
    delete(filter: FilterQuery<Book>): Promise<BookDocument>;
    update(filter: FilterQuery<Book>, update: Partial<Book>, options?: QueryOptions): Promise<BookDocument>;
}
