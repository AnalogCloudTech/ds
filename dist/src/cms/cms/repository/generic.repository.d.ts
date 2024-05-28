import { RepositoryContract } from '@/cms/cms/repository/repository.contract';
import { Axios } from 'axios';
import { DataObject, QueryParams, ResponseArrayObject } from '@/cms/cms/types/common';
export declare abstract class GenericRepository<Entity> implements RepositoryContract<Entity> {
    protected http: Axios;
    protected baseRoute: string;
    constructor(http: Axios);
    delete(id: number): Promise<Entity>;
    findAllPaginated(query?: QueryParams): Promise<ResponseArrayObject<DataObject<Entity>>>;
    findById(id: number): Promise<DataObject<Entity> | null>;
    first(query: QueryParams): Promise<DataObject<Entity> | null>;
    store<DTO = any>(data: DTO): Promise<Entity>;
    update<DTO = any>(id: number, data: DTO): Promise<Entity>;
}
