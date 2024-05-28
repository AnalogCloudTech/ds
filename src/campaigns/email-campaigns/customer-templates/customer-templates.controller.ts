import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerTemplatesService } from './customer-templates.service';
import { CreateCustomerTemplateDto } from './dto/create-customer-template.dto';
import { UpdateCustomerTemplateDto } from './dto/update-customer-template.dto';
import { CustomerPipeByIdentities } from '@/customers/customers/pipes/transform/customer-by-identities.pipe';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerTemplate as DomainCustomerTemplate } from './domain/customer-template';
import { Serialize } from '@/internal/common/interceptors/serialize.interceptor';
import { TemplateVariablesValidatePipe } from '@/campaigns/email-campaigns/common/pipes/template-variables.validate.pipe';
import { Paginator, PaginatorTransformPipe } from '@/internal/utils/paginator';
import { SchemaId } from '@/internal/types/helpers';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';

@Controller({ path: 'email-campaigns/customer-templates', version: '1' })
export class CustomerTemplatesController {
  constructor(
    private readonly customerTemplatesService: CustomerTemplatesService,
  ) {}

  @Serialize(DomainCustomerTemplate)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Body(TemplateVariablesValidatePipe)
    createCustomerTemplateDto: CreateCustomerTemplateDto,
  ) {
    const dto: CreateCustomerTemplateDto = {
      ...createCustomerTemplateDto,
      customer: customer._id,
    };
    return this.customerTemplatesService.store(customer, dto);
  }

  @Serialize(DomainCustomerTemplate)
  @Get()
  findAll(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
    @Query(ValidationTransformPipe, PaginatorTransformPipe)
    { page, perPage }: Paginator,
  ) {
    return this.customerTemplatesService.findAllByCustomer(
      customer,
      page,
      perPage,
    );
  }

  @Serialize(DomainCustomerTemplate)
  @Get('dropdown/list')
  public listDropDown(
    @Param(CustomerPipeByIdentities) customer: CustomerDocument,
  ) {
    return this.customerTemplatesService.listDropdown(customer);
  }

  @Serialize(DomainCustomerTemplate)
  @Get(':id')
  findOne(@Param('id') id: SchemaId) {
    return this.customerTemplatesService.findById(id);
  }

  @Serialize(DomainCustomerTemplate)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: SchemaId,
    @Body(TemplateVariablesValidatePipe)
    updateCustomerTemplateDto: UpdateCustomerTemplateDto,
  ) {
    return this.customerTemplatesService.update(id, updateCustomerTemplateDto);
  }

  @Serialize(DomainCustomerTemplate)
  @Delete(':id')
  remove(@Param('id') id: SchemaId) {
    return this.customerTemplatesService.remove(id);
  }
}
