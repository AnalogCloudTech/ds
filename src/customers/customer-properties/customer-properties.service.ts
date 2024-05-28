import { Injectable, Logger } from '@nestjs/common';
import { CustomerPropertiesRepository } from '@/customers/customer-properties/repositories/customer-properties.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CreateCustomerPropertiesDto } from '@/customers/customer-properties/dto/create-customer-properties.dto';
import { CustomerPropertiesDocument } from '@/customers/customer-properties/schemas/customer-properties.schemas';
import { GetAllFromCustomerDto } from '@/customers/customer-properties/dto/get-all-from-customer.dto';
import { FilterQuery, QueryOptions } from 'mongoose';
import { UpdateCustomerPropertiesDto } from '@/customers/customer-properties/dto/update-customer-properties.dto';
import { CustomerPropertyNotFoundException } from '@/customers/customer-properties/Exceptions/customer-property-not-found.exception';
import { Version } from '@/customers/customer-properties/domain/types';
import { SchemaId } from '@/internal/types/helpers';
import { DateTime } from 'luxon';
import { LoggerPayload } from '@/internal/utils/logger';
import { CONTEXT_CUSTOMER_PROPERTY_SERVICE } from '@/internal/common/contexts';
@Injectable()
export class CustomerPropertiesService {
  constructor(
    private readonly repository: CustomerPropertiesRepository,
    private readonly logger: Logger,
  ) {}

  async create(
    dto: CreateCustomerPropertiesDto,
    customer?: CustomerDocument,
  ): Promise<CustomerPropertiesDocument> {
    const data = {
      ...dto,
      createdBy: customer?._id,
    };

    return this.repository.store(data);
  }

  async findAll(
    dto: GetAllFromCustomerDto,
  ): Promise<Array<CustomerPropertiesDocument>> {
    const options: QueryOptions = {
      lean: true,
      sort: { module: 'asc', name: 'asc' },
      populate: ['customer'],
    };

    return this.repository.findAll(dto.filter, options);
  }

  async update(
    id: string,
    dto: UpdateCustomerPropertiesDto,
    customer: CustomerDocument,
  ): Promise<CustomerPropertiesDocument> {
    const findQuery: FilterQuery<CustomerPropertiesDocument> = {
      _id: { $eq: id },
    };

    const prop = await this.repository.first(findQuery);

    if (!prop) {
      throw new CustomerPropertyNotFoundException();
    }

    const version = <Version>{
      value: prop.value,
      updatedBy: customer._id,
      updatedAt: new Date(),
    };
    const data = {
      ...dto,
      updatedBy: customer._id,
      versions: [version, ...prop.versions],
    };

    return this.repository.update(prop._id, data);
  }

  async findOne(id: string): Promise<CustomerPropertiesDocument> {
    const query: FilterQuery<CustomerPropertiesDocument> = {
      _id: { $eq: id },
    };

    const prop = await this.repository.first(query);
    this.logger.log(
      {
        payload: <LoggerPayload>{
          usageDate: DateTime.now(),
          prop,
        },
      },
      CONTEXT_CUSTOMER_PROPERTY_SERVICE,
    );
    if (!prop) {
      throw new CustomerPropertyNotFoundException();
    }

    return prop;
  }

  async softDelete(id: SchemaId): Promise<CustomerPropertiesDocument> {
    return this.repository.update(id, { deletedAt: DateTime.now().toJSDate() });
  }
}
