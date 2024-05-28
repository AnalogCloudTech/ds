import { SchemaId } from '@/internal/types/helpers';
import { ProductDocument } from '@/onboard/products/schemas/product.schema';
import { HydratedDocument } from 'mongoose';
import { CreditType } from '@/credits/domain/book-credits';
export declare class BookCreditsOption {
    credits: number;
    perAmount: number;
    totalAmount: number;
    isActive: boolean;
    type?: CreditType;
    productId: SchemaId | ProductDocument;
    savings?: string;
}
export type BookCreditDocument = HydratedDocument<BookCreditsOption>;
export declare const BookCreditSchema: import("mongoose").Schema<BookCreditsOption, import("mongoose").Model<BookCreditsOption, any, any, any>, any, any>;
