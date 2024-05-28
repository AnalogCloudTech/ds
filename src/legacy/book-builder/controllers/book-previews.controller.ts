import { BookPreviewsService } from '../services/book-previews.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateBookPreviewsDto } from '../dto/create-book-previews.dto';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { BookPreviewsDomain } from '@/legacy/book-builder/domain/BookPreviews';
import { BookPreviewsDocument } from '@/legacy/book-builder/schemas/book-previews.schema';
import { SchemaId } from '@/internal/types/helpers';
import { UpdateBookPreviewsDto } from '@/legacy/book-builder/dto/update-book-previews.dto';

@Controller({ path: 'book-previews', version: '1' })
export class BookPreviewsController {
  constructor(private readonly bookPreviewsService: BookPreviewsService) {}

  @Post()
  create(
    @Body(ValidationPipe) dto: CreateBookPreviewsDto,
  ): Promise<BookPreviewsDocument> {
    return this.bookPreviewsService.create(dto);
  }

  @Get()
  @Serialize(BookPreviewsDomain)
  findAll(
    @Query(PaginatorTransformPipe)
    { page = 0, perPage = 15 }: Paginator,
  ) {
    return this.bookPreviewsService.find(
      {},
      { skip: page * perPage, limit: perPage },
    );
  }

  @Delete(':id')
  @Serialize(BookPreviewsDomain)
  delete(@Param('id') id: SchemaId) {
    return this.bookPreviewsService.delete(id);
  }

  @Patch(':id')
  @Serialize(BookPreviewsDomain)
  update(
    @Param('id') id: SchemaId,
    @Body(ValidationPipe) dto: UpdateBookPreviewsDto,
  ) {
    return this.bookPreviewsService.update(id, dto);
  }
}
