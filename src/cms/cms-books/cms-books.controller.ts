import { Controller, Get } from '@nestjs/common';
import { CmsBooksService } from './cms-books.service';
import { CmsBookDomain } from '@/cms/cms-books/domain/cms-book';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';

@Controller({
  version: '1',
  path: 'cms-books',
})
export class CmsBooksController {
  constructor(private readonly cmsBooksService: CmsBooksService) {}

  @Serialize(CmsBookDomain)
  @Get('/')
  async list(): Promise<Array<CmsBookDomain>> {
    return this.cmsBooksService.findAll();
  }
}
