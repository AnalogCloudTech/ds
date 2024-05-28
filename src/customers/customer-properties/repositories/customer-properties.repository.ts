import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CustomerProperties,
  CustomerPropertiesDocument,
} from '@/customers/customer-properties/schemas/customer-properties.schemas';
import { Model } from 'mongoose';
import { GenericRepository } from '@/internal/common/repository/generic.repository';

@Injectable()
export class CustomerPropertiesRepository extends GenericRepository<CustomerPropertiesDocument> {
  constructor(
    @InjectModel(CustomerProperties.name)
    protected readonly model: Model<CustomerPropertiesDocument>,
  ) {
    super(model);
  }
}
