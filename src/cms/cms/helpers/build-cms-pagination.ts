import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import { DataObject, ResponseArrayObject } from '@/cms/cms/types/common';
import { get } from 'lodash';
import { flattenCmsObject } from '@/cms/cms/helpers/flatten-cms-object';

export function buildCmsPagination<T>(
  response: ResponseArrayObject<DataObject<T>>,
): PaginatorSchematicsInterface<T> {
  const { data, meta } = response;

  const list = data.map<T>((item) => flattenCmsObject(item));
  const total = get(meta, ['pagination', 'total'], 0);
  const perPage = get(meta, ['pagination', 'pageSize'], 15);
  const currentPage = get(meta, ['pagination', 'page'], 1) - 1;

  return PaginatorSchema.build(total, list, currentPage, perPage);
}
