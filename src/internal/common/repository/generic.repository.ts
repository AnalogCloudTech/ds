import { RepositoryContract } from '@/internal/common/repository/repository.contract';
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import {
  PaginatorSchema,
  PaginatorSchematicsInterface,
} from '@/internal/utils/paginator';
import {
  Projection,
  SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT,
} from '@/internal/common/repository/types';
import { SchemaId } from '@/internal/types/helpers';

export abstract class GenericRepository<ModelDocument>
  implements RepositoryContract<ModelDocument>
{
  protected constructor(protected readonly model: Model<ModelDocument>) {}

  async delete(id: Types.ObjectId): Promise<ModelDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findAll(
    query: FilterQuery<ModelDocument>,
    options: QueryOptions = { sort: { credits: 'asc' } },
    projection?: Projection<ModelDocument>,
  ): Promise<Array<ModelDocument>> {
    return this.model.find(query, projection, options).exec();
  }

  async findAllPaginated(
    query?: FilterQuery<ModelDocument>,
    options: QueryOptions = {
      skip: 0,
      limit: 10,
      lean: true,
    },
    projection?: Projection<ModelDocument>,
  ): Promise<PaginatorSchematicsInterface<ModelDocument>> {
    const [total, data] = await Promise.all([
      this.model.countDocuments(query).exec(),
      this.model.find(query, projection, options).exec(),
    ]);
    const page = options.skip / options.limit ?? 0;
    return PaginatorSchema.build<ModelDocument>(
      total,
      data,
      page,
      options.limit ?? 10,
    );
  }

  async findById(id: SchemaId, options?: QueryOptions): Promise<ModelDocument> {
    return this.model.findById(id, {}, options).exec();
  }

  async store<DTO>(data: DTO): Promise<ModelDocument> {
    return this.model.create(data);
  }

  async first(query: FilterQuery<ModelDocument>): Promise<ModelDocument> {
    return this.model.findOne(query).exec();
  }

  async update<DTO>(
    id: SchemaId,
    data: UpdateQuery<DTO>,
  ): Promise<ModelDocument> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async count(filter: FilterQuery<ModelDocument>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async searchUniqueField(
    keyword: string,
    field: string,
    limit = SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT,
  ): Promise<string[]> {
    const results = await this.model
      .aggregate<{ _id: string }>([
        { $match: { [field]: { $regex: new RegExp(keyword, 'i') } } },
        { $group: { _id: `$${field}` } },
        { $limit: limit },
        { $project: { _id: 1 } },
      ])
      .exec();
    return results.map((result) => result?._id);
  }

  async searchUniqueFieldPaginated(
    keyword: string,
    field: string,
    limit = SEARCH_UNIQUE_FIELD_DEFAULT_LIMIT,
    page?: number,
    isUpsell?: boolean,
  ): Promise<PaginatorSchematicsInterface> {
    const skip: number = page * limit;
    let isUpsellQuery = {};

    if (isUpsell !== undefined) {
      isUpsellQuery = { sessionId: { $exists: isUpsell } };
    }

    const results = (
      await this.model
        .aggregate<{ _id: string }>([
          {
            $match: {
              [field]: { $regex: new RegExp(keyword, 'i') },
              ...isUpsellQuery,
            },
          },
          { $group: { _id: `$${field}` } },
          { $skip: skip },
          { $limit: limit },
          { $project: { _id: 1 } },
        ])
        .exec()
    ).map((result) => result?._id);

    const totalResults = await this.model
      .aggregate<{ total: number }>([
        {
          $match: {
            [field]: { $regex: new RegExp(keyword, 'i') },
            ...isUpsellQuery,
          },
        },
        { $group: { _id: `$${field}` } },
        { $project: { _id: 1 } },
        { $count: 'total' },
      ])
      .exec();

    return PaginatorSchema.build(
      totalResults[0]?.total || 0,
      results,
      page,
      limit,
    );
  }
}
