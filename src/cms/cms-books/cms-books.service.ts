import { Inject, Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { CmsBooksRepository } from '@/cms/cms-books/cms-books.repository';
import { CmsBookDomain } from '@/cms/cms-books/domain/cms-book';

@Injectable()
export class CmsBooksService {
  constructor(
    @Inject('HTTP_BOOK_CMS') private readonly http: Axios,
    protected readonly repository: CmsBooksRepository,
  ) {}

  async findAll(): Promise<Array<CmsBookDomain>> {
    return this.repository.findAll();
  }
}
