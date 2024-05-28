import {
  Paginator,
  PaginatorSchematicsInterface,
  PaginatorTransformPipe,
} from '@/internal/utils/paginator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributeDomain } from './domain/attributes.domain';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'social-media/attributes', version: '1' })
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Serialize(AttributeDomain)
  @Get('user')
  findAllByCutomerId(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.attributesService.findAllByCustomerId(customer);
  }

  @Serialize(AttributeDomain)
  @Post()
  create(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body() createAttributeDto: CreateAttributeDto,
  ) {
    return this.attributesService.create(customer, createAttributeDto);
  }

  @Serialize(AttributeDomain)
  @Get()
  findAll(
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ): Promise<PaginatorSchematicsInterface> {
    return this.attributesService.findAll(page, perPage);
  }

  @Serialize(AttributeDomain)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(id);
  }

  @Serialize(AttributeDomain)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributesService.update(id, updateAttributeDto);
  }

  @Serialize(AttributeDomain)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(id);
  }
}
