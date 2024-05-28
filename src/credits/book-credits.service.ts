import { Injectable } from '@nestjs/common';
import { SchemaId } from '@/internal/types/helpers';
import { BookCreditDocument } from './schemas/book-credits.schema';
import { CreateBookCreditsDto } from './dto/create-book-credits.dto';
import { BookCreditsRepository } from './book-credits.repository';
import { CreditType } from '@/credits/domain/book-credits';

@Injectable()
export class BookCreditsService {
  constructor(private readonly bookCreditsRepository: BookCreditsRepository) {}
  async create(credits: CreateBookCreditsDto): Promise<BookCreditDocument> {
    return this.bookCreditsRepository.store(credits);
  }

  async getAllBookCredit(
    type = CreditType.Book,
  ): Promise<Array<BookCreditDocument>> {
    const filter = {
      type,
    };
    return this.bookCreditsRepository.findAggregate(filter);
  }

  async getBookCreditById(id: SchemaId): Promise<BookCreditDocument> {
    return this.bookCreditsRepository.findById(id);
  }

  async updateBookCredit<UpdateBookCreditsDto>(
    id: SchemaId,
    data: UpdateBookCreditsDto,
  ): Promise<BookCreditDocument> {
    return this.bookCreditsRepository.update(id, data);
  }

  async deleteBookCredit(id: SchemaId): Promise<BookCreditDocument> {
    return this.bookCreditsRepository.delete(id);
  }
}
