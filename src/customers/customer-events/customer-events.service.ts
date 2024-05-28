import { Injectable } from '@nestjs/common';
import { CustomerEventsRepository } from '@/customers/customer-events/repositories/customer-events.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerEventDocument } from '@/customers/customer-events/schemas/customer-events.schema';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { FilterQuery, QueryOptions } from 'mongoose';
import { CreateCustomerEventDto } from '@/customers/customer-events/dto/create-customer-event.dto';

@Injectable()
export class CustomerEventsService {
  constructor(
    private readonly customerEventsRepository: CustomerEventsRepository,
  ) {}

  async createEvent(customer: CustomerDocument, dto: CreateCustomerEventDto) {
    const { event, metadata } = dto;
    const data = {
      customer: customer._id,
      event: event,
      metadata,
    };
    return this.customerEventsRepository.store(data);
  }

  async getAllFromCustomer(
    customer: CustomerDocument,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<CustomerEventDocument>> {
    const filter: FilterQuery<CustomerEventDocument> = {
      customer: customer._id,
    };
    const options: QueryOptions = {
      skip: page * perPage,
      limit: perPage,
      lean: true,
      sort: { createdAt: 'desc' },
    };

    return this.customerEventsRepository.findAllPaginated(filter, options);
  }

  async getAllByCustomerId(
    customerId: string,
    page: number,
    perPage: number,
  ): Promise<PaginatorSchematicsInterface<CustomerEventDocument>> {
    const filter: FilterQuery<CustomerEventDocument> = {
      customer: { $eq: customerId },
    };
    const options: QueryOptions = {
      skip: page * perPage,
      limit: perPage,
      lean: true,
      sort: { createdAt: 'desc' },
    };

    return this.customerEventsRepository.findAllPaginated(filter, options);
  }
}
