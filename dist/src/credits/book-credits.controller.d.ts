import { CreateBookCreditsDto } from './dto/create-book-credits.dto';
import { BookCreditDocument } from './schemas/book-credits.schema';
import { SchemaId } from '@/internal/types/helpers';
import { BookCreditsService } from './book-credits.service';
import { UpdateBookCreditsDto } from './dto/update-book-credits.dto';
import { CreditType } from './domain/book-credits';
export declare class BookCreditsController {
    private readonly bookCreditsService;
    constructor(bookCreditsService: BookCreditsService);
    createBookCredit(credits: CreateBookCreditsDto): Promise<BookCreditDocument>;
    getBookCredit(type: CreditType): Promise<Array<BookCreditDocument>>;
    getBookCreditById(id: SchemaId): Promise<BookCreditDocument>;
    updateBookCredit(id: SchemaId, credits: UpdateBookCreditsDto): Promise<BookCreditDocument>;
    deleteBookCredit(id: SchemaId): Promise<BookCreditDocument>;
}
