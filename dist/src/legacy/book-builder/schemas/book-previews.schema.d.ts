import { HydratedDocument } from 'mongoose';
export declare class BookPreviews {
    bookId: string;
    bookTitle: string;
    pdfUrl: string;
}
export type BookPreviewsDocument = HydratedDocument<BookPreviews>;
export declare const BookPreviewsSchema: import("mongoose").Schema<BookPreviews, import("mongoose").Model<BookPreviews, any, any, any>, any, any>;
