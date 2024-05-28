import { DataObject, ResponseArrayObject } from '@/cms/cms/types/common';
export interface RepositoryContract<T> {
    findById(id: number): Promise<DataObject<T>>;
    findAllPaginated(query: any): Promise<ResponseArrayObject<DataObject<T>>>;
    first(query: any): Promise<DataObject<T>>;
    update<DTO = any>(id: number, data: DTO): Promise<T>;
    store<DTO = any>(data: DTO): Promise<T>;
    delete(id: number): Promise<T>;
}
