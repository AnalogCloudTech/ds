import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { DataObject, ResponseArrayObject } from '@/cms/cms/types/common';
export declare function buildCmsPagination<T>(response: ResponseArrayObject<DataObject<T>>): PaginatorSchematicsInterface<T>;
