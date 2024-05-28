import { BookPreviewsRepository } from '../repositories/book-previews.respository';
import { CreateBookPreviewsDto } from '../dto/create-book-previews.dto';
import { UpdateBookPreviewsDto } from '../dto/update-book-previews.dto';
import { FilterQuery, QueryOptions } from 'mongoose';
import {
  BookPreviews,
  BookPreviewsDocument,
} from '../schemas/book-previews.schema';
import { Injectable } from '@nestjs/common';
import { SchemaId } from '@/internal/types/helpers';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';

@Injectable()
export class BookPreviewsService {
  constructor(
    private readonly bookPreviewsRepository: BookPreviewsRepository,
  ) {}

  public create(dto: CreateBookPreviewsDto): Promise<BookPreviewsDocument> {
    return this.bookPreviewsRepository.store(dto);
  }

  public find(
    filter: FilterQuery<BookPreviews>,
    options: QueryOptions = {},
  ): Promise<PaginatorSchematicsInterface<BookPreviewsDocument>> {
    return this.bookPreviewsRepository.findAllPaginated(filter, options);
  }

  public delete(id: SchemaId): Promise<BookPreviewsDocument> {
    return this.bookPreviewsRepository.delete(id);
  }

  public update(
    id: SchemaId,
    dto: UpdateBookPreviewsDto,
  ): Promise<BookPreviewsDocument> {
    return this.bookPreviewsRepository.update(id, dto);
  }
}
