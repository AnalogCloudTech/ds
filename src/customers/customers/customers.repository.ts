import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage, QueryOptions } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from '@/customers/customers/schemas/customer.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { FindCustomerByQueryDto } from '@/customers/customers/dto/find-customer-by-query.dto';
import { Status } from '@/customers/customers/domain/types';

@Injectable()
export class CustomersRepository extends GenericRepository<Customer> {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<Customer>,
  ) {
    super(customerModel);
  }

  async findAll(
    filter: FilterQuery<CustomerDocument>,
    options: QueryOptions = { lean: true },
  ): Promise<Array<CustomerDocument>> {
    return this.customerModel.find(filter, {}, options).exec();
  }

  async find(
    filter: FilterQuery<Customer>,
    page = 0,
    limit = 25,
  ): Promise<CustomerDocument[]> {
    const skip = page * limit;
    return this.customerModel.find(filter).skip(skip).limit(limit).exec();
  }

  async findOne(filter: FilterQuery<Customer>) {
    return this.customerModel.findOne(filter).exec();
  }

  async listByNameOrEmail(
    nameOrEmail: string,
  ): Promise<Array<Partial<CustomerDocument>> | null> {
    const filter: FilterQuery<CustomerDocument> = {
      $or: [
        { fullName: new RegExp(nameOrEmail) },
        { email: new RegExp(nameOrEmail) },
      ],
    };

    return this.customerModel.aggregate<
      Pick<CustomerDocument, '_id' | 'email'> & { fullName: string }
    >([
      {
        $project: {
          _id: 1,
          email: 1,
          fullName: { $concat: ['$firstName', ' ', '$lastName'] },
        },
      },
      {
        $match: {
          ...filter,
        },
      },
    ]);
  }

  async findByPhone(phone: string): Promise<CustomerDocument | null> {
    const pipeline: PipelineStage[] = [
      {
        $addFields: {
          phoneWithoutFormat: {
            $replaceAll: {
              input: '$phone',
              find: '-',
              replacement: '',
            },
          },
        },
      },
      {
        $match: {
          phone: { $ne: null },
          phoneWithoutFormat: { $eq: phone },
        },
      },
    ];

    const result = await this.customerModel.aggregate<CustomerDocument>(
      pipeline,
    );

    return result.length ? result[0] : null;
  }

  public async findByQuery({
    query,
    perPage,
    page,
  }: FindCustomerByQueryDto): Promise<CustomerDocument[]> {
    return this.customerModel.find(
      {
        $or: [
          { email: new RegExp(query, 'i') },
          { firstName: new RegExp(query, 'i') },
          { lastName: new RegExp(query, 'i') },
          { chargifyId: query },
          { stripeId: query },
        ],
        status: Status.ACTIVE,
      },
      {},
      { skip: perPage * page, limit: perPage },
    );
  }
}
