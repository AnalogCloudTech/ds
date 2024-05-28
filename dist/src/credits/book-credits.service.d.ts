import { SchemaId } from '@/internal/types/helpers';
import { BookCreditDocument } from './schemas/book-credits.schema';
import { CreateBookCreditsDto } from './dto/create-book-credits.dto';
import { BookCreditsRepository } from './book-credits.repository';
import { CreditType } from '@/credits/domain/book-credits';
export declare class BookCreditsService {
    private readonly bookCreditsRepository;
    constructor(bookCreditsRepository: BookCreditsRepository);
    create(credits: CreateBookCreditsDto): Promise<BookCreditDocument>;
    getAllBookCredit(type?: CreditType): Promise<Array<BookCreditDocument>>;
    getBookCreditById(id: SchemaId): Promise<BookCreditDocument>;
    updateBookCredit<UpdateBookCreditsDto>(id: SchemaId, data: UpdateBookCreditsDto): Promise<BookCreditDocument>;
    deleteBookCredit(id: SchemaId): Promise<BookCreditDocument>;
}
