import { RepositoryContract } from '@/cms/cms/repository/repository.contract';
import { Axios } from 'axios';
import {
  DataObject,
  QueryParams,
  ResponseArrayObject,
  ResponseObject,
} from '@/cms/cms/types/common';
import { HttpStatus } from '@nestjs/common';
import { CmsPopulateBuilder } from '@/internal/utils/cms/populate/cms.populate.builder';

export abstract class GenericRepository<Entity>
  implements RepositoryContract<Entity>
{
  protected baseRoute: string;
  public constructor(protected http: Axios) {}

  /**
   * if anyone need this, please implement following the examples
   */
  delete(id: number): Promise<Entity> {
    return Promise.resolve(<Entity>{});
  }

  async findAllPaginated(
    query?: QueryParams,
  ): Promise<ResponseArrayObject<DataObject<Entity>>> {
    const queryString = CmsPopulateBuilder.build(query);
    const { data } = await this.http.get<
      ResponseArrayObject<DataObject<Entity>>
    >(`${this.baseRoute}?${queryString}`);

    return data;
  }

  async findById(id: number): Promise<DataObject<Entity> | null> {
    const { status, data } = await this.http.get<ResponseObject<Entity>>(
      `${this.baseRoute}/${id}`,
    );

    return status === HttpStatus.OK ? data.data : null;
  }

  async first(query: QueryParams): Promise<DataObject<Entity> | null> {
    const queryString = CmsPopulateBuilder.build(query);
    const { status, data } = await this.http.get<
      ResponseArrayObject<DataObject<Entity>>
    >(`${this.baseRoute}?${queryString}`);

    return status === HttpStatus.OK && data.data.length > 0
      ? data.data[0]
      : null;
  }

  store<DTO = any>(data: DTO): Promise<Entity> {
    return Promise.resolve(<Entity>{});
  }
  update<DTO = any>(id: number, data: DTO): Promise<Entity> {
    return Promise.resolve(<Entity>{});
  }
}
