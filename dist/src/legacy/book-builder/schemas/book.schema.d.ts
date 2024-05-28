import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import mongoose, { HydratedDocument } from 'mongoose';
export declare class Book {
    customer: mongoose.Types.ObjectId | CustomerDocument;
    bookId: string;
    title: string;
    landingPageUrl?: string;
    digitalBookUrl?: string;
    customLandingPageUrl?: string;
}
export type BookDocument = HydratedDocument<Book>;
export declare const BookSchema: mongoose.Schema<Book, mongoose.Model<Book, any, any, any>, any, any>;
