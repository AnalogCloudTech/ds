import { CastableTo } from '@/internal/common/utils';
import { Document } from 'mongoose';
import { BookOption as DomainBookOption } from '../domain/book-option';
import { BookOptionImageUrl } from '../domain/types';
export declare class BookOption extends CastableTo<DomainBookOption> {
    title: string;
    bookId: string;
    templateId: string;
    image: BookOptionImageUrl;
}
export type BookOptionDocument = BookOption & Document;
export declare const BookOptionSchema: import("mongoose").Schema<BookOption, import("mongoose").Model<BookOption, any, any, any>, any, any>;
