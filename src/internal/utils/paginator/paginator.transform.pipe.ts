import { Injectable, PipeTransform } from '@nestjs/common';
import { Paginator } from '@/internal/utils/paginator/index';

@Injectable()
export default class PaginatorTransformPipe implements PipeTransform {
  transform({ page, perPage }: Paginator): Paginator {
    if (!page || page === 1) {
      page = 0;
    } else {
      page--;
    }

    if (!perPage) {
      perPage = 15;
    }

    return { page, perPage };
  }
}
