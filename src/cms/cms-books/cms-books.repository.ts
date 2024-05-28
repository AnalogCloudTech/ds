import { Axios } from 'axios';
import { CmsBookDomain } from '@/cms/cms-books/domain/cms-book';
import { LoggerPayload } from '@/internal/utils/logger';
import { DateTime } from 'luxon';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CONTEXT_CMS_BOOK_ERROR } from '@/internal/common/contexts';

export class CmsBooksRepository {
  private baseRoute = 'books';
  constructor(private readonly http: Axios, private readonly logger: Logger) {}

  async findAll(): Promise<Array<CmsBookDomain>> {
    try {
      const { data } = await this.http.get<Array<CmsBookDomain>>(
        this.baseRoute,
      );
      return data;
    } catch (error) {
      if (error instanceof Error) {
        const payload: LoggerPayload = {
          usageDate: DateTime.now(),
          error: error?.message,
          message: 'Unable to fetch books from CMS',
          method: 'CmsBooksRepository@findAll',
        };

        this.logger.error({ payload }, '', CONTEXT_CMS_BOOK_ERROR);
        throw new HttpException(payload, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
