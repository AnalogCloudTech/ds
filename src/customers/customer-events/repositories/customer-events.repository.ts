import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CustomerEvent,
  CustomerEventDocument,
} from '@/customers/customer-events/schemas/customer-events.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';

export class CustomerEventsRepository extends GenericRepository<CustomerEventDocument> {
  constructor(
    @InjectModel(CustomerEvent.name)
    protected readonly model: Model<CustomerEventDocument>,
  ) {
    super(model);
  }
}
