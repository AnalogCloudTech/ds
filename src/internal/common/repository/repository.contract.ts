import { FilterQuery, QueryOptions } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import { Projection } from '@/internal/common/repository/types';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';

export interface RepositoryContract<T> {
  findById(id: SchemaId, options?: QueryOptions): Promise<T>;

  findAll(query?: FilterQuery<T>): Promise<Array<T>>;

  findAllPaginated(
    query?: FilterQuery<T>,
    options?: QueryOptions,
    projection?: Projection<T>,
  ): Promise<PaginatorSchematicsInterface<T>>;

  first(query: FilterQuery<T>): Promise<T>;

  update<DTO = any>(id: SchemaId, data: DTO): Promise<T>;

  store<DTO = any>(data: DTO): Promise<T>;

  delete(id: SchemaId): Promise<T>;
}
