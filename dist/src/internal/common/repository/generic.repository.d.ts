import { RepositoryContract } from '@/internal/common/repository/repository.contract';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Projection } from '@/internal/common/repository/types';
import { SchemaId } from '@/internal/types/helpers';
export declare abstract class GenericRepository<ModelDocument> implements RepositoryContract<ModelDocument> {
    protected readonly model: Model<ModelDocument>;
    protected constructor(model: Model<ModelDocument>);
    delete(id: Types.ObjectId): Promise<ModelDocument>;
    findAll(query: FilterQuery<ModelDocument>, options?: QueryOptions, projection?: Projection<ModelDocument>): Promise<Array<ModelDocument>>;
    findAllPaginated(query?: FilterQuery<ModelDocument>, options?: QueryOptions, projection?: Projection<ModelDocument>): Promise<PaginatorSchematicsInterface<ModelDocument>>;
    findById(id: SchemaId, options?: QueryOptions): Promise<ModelDocument>;
    store<DTO>(data: DTO): Promise<ModelDocument>;
    first(query: FilterQuery<ModelDocument>): Promise<ModelDocument>;
    update<DTO>(id: SchemaId, data: UpdateQuery<DTO>): Promise<ModelDocument>;
    count(filter: FilterQuery<ModelDocument>): Promise<number>;
}
