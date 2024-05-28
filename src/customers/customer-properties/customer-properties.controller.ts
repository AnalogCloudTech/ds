import { CustomerPropertiesService } from '@/customers/customer-properties/customer-properties.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCustomerPropertiesDto } from '@/customers/customer-properties/dto/create-customer-properties.dto';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { GetAllFromCustomerDto } from '@/customers/customer-properties/dto/get-all-from-customer.dto';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { CustomerProperties as CustomerPropertiesDomain } from '@/customers/customer-properties/domain/customer-properties';
import { UpdateCustomerPropertiesDto } from '@/customers/customer-properties/dto/update-customer-properties.dto';
import { FilterQuery } from 'mongoose';
import { CustomerPropertiesDocument } from '@/customers/customer-properties/schemas/customer-properties.schemas';

@Controller({ path: 'customer-properties', version: '1' })
export class CustomerPropertiesController {
  constructor(private readonly service: CustomerPropertiesService) {}

  @Serialize(CustomerPropertiesDomain)
  @Get()
  findAll(@Query('filter') filter: FilterQuery<CustomerPropertiesDocument>) {
    return this.service.findAll(<GetAllFromCustomerDto>{
      filter,
    });
  }

  @Serialize(CustomerPropertiesDomain)
  @Post()
  create(
    @Body(ValidationPipe) dto: CreateCustomerPropertiesDto,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.service.create(dto, customer);
  }

  @Serialize(CustomerPropertiesDomain)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(ValidationPipe) dto: UpdateCustomerPropertiesDto,
  ) {
    return this.service.update(id, dto, customer);
  }

  @Serialize(CustomerPropertiesDomain)
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
