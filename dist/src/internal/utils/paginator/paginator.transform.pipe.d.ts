import { PipeTransform } from '@nestjs/common';
import { Paginator } from '@/internal/utils/paginator/index';
export default class PaginatorTransformPipe implements PipeTransform {
    transform({ page, perPage }: Paginator): Paginator;
}
