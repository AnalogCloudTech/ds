import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BookDomain } from '../domain/book';
import { CreateBookDto } from '../dto/create-book.dto';
import { BookDocument } from '../schemas/book.schema';
import { BooksService } from '../services/books.service';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'books', version: '1' })
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Serialize(BookDomain)
  create(
    @Body() dto: CreateBookDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.booksService.create(dto, customer);
  }

  @Get()
  @Serialize(BookDomain)
  findAll(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page = 0, perPage = 15 }: Paginator,
  ) {
    return this.booksService.find(
      {},
      { skip: page * perPage, limit: perPage },
      customer,
    );
  }

  @Delete(':id')
  @Serialize(BookDomain)
  delete(
    @Param('id') id: string,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.booksService.delete({ _id: id }, customer);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Serialize(BookDomain)
  update(
    @Param('id') id: string,
    @Body() dto: Partial<BookDocument>,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.booksService.update({ _id: id }, dto, customer);
  }
}
