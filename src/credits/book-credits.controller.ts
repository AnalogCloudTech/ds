import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { IsAdminGuard } from '@/internal/common/guards/is-admin.guard';
import { CreateBookCreditsDto } from './dto/create-book-credits.dto';
import { BookCreditDocument } from './schemas/book-credits.schema';
import { SchemaId } from '@/internal/types/helpers';
import { BookCreditsService } from './book-credits.service';
import { UpdateBookCreditsDto } from './dto/update-book-credits.dto';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import {BookCredits, CreditType} from './domain/book-credits';

@Controller({ path: 'book-credits', version: '1' })
export class BookCreditsController {
  constructor(private readonly bookCreditsService: BookCreditsService) {}

  @UseGuards(IsAdminGuard)
  @Serialize(BookCredits)
  @Post('/')
  createBookCredit(
    @Body(ValidationPipe) credits: CreateBookCreditsDto,
  ): Promise<BookCreditDocument> {
    return this.bookCreditsService.create(credits);
  }

  @Serialize(BookCredits)
  @Get('/')
  getBookCredit(
    @Query('type') type: CreditType,
  ): Promise<Array<BookCreditDocument>> {
    return this.bookCreditsService.getAllBookCredit(type);
  }

  @Serialize(BookCredits)
  @Get('/:id')
  getBookCreditById(@Param('id') id: SchemaId): Promise<BookCreditDocument> {
    return this.bookCreditsService.getBookCreditById(id);
  }

  @Serialize(BookCredits)
  @UseGuards(IsAdminGuard)
  @Patch('/:id')
  updateBookCredit(
    @Param('id') id: SchemaId,
    @Body(ValidationPipe) credits: UpdateBookCreditsDto,
  ): Promise<BookCreditDocument> {
    return this.bookCreditsService.updateBookCredit(id, credits);
  }

  @Serialize(BookCredits)
  @UseGuards(IsAdminGuard)
  @Delete('/:id')
  deleteBookCredit(@Param('id') id: SchemaId): Promise<BookCreditDocument> {
    return this.bookCreditsService.deleteBookCredit(id);
  }
}
