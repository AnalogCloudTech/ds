import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerEventsService } from './customer-events.service';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CustomerEvents as CustomerEventsDomain } from '@/customers/customer-events/domain/customer-events';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { CreateCustomerEventDto } from '@/customers/customer-events/dto/create-customer-event.dto';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'customer-events', version: '1' })
export class CustomerEventsController {
  constructor(private readonly customerEventsService: CustomerEventsService) {}

  @Serialize(CustomerEventsDomain)
  @Post()
  create(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe) dto: CreateCustomerEventDto,
  ) {
    return this.customerEventsService.createEvent(customer, dto);
  }

  @Serialize(CustomerEventsDomain)
  @Get()
  async findAll(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.customerEventsService.getAllFromCustomer(
      customer,
      page,
      perPage,
    );
  }

  @Serialize(CustomerEventsDomain)
  @Get('/:customerId')
  async findAllByCustomerId(
    @Param('customerId') customerId: string,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.customerEventsService.getAllByCustomerId(
      customerId,
      page,
      perPage,
    );
  }
}
