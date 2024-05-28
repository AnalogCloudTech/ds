import { Injectable } from '@nestjs/common';
import { UpdateCustomerTemplateDto } from '@/campaigns/email-campaigns/customer-templates/dto/update-customer-template.dto';
import { CreateCustomerTemplateDto } from '@/campaigns/email-campaigns/customer-templates/dto/create-customer-template.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerTemplateRepository } from '@/campaigns/email-campaigns/customer-templates/repositories/customer-template.repository';
import { CmsService } from '@/cms/cms/cms.service';
import { CreateTemplate, Template } from '@/cms/cms/types/template';
import { FilterQuery, QueryOptions } from 'mongoose';
import { CustomerTemplateDocument } from '@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema';
import { SchemaId } from '@/internal/types/helpers';
import { Projection } from '@/internal/common/repository/types';
import { pick } from 'lodash';

@Injectable()
export class CustomerTemplatesService {
  constructor(
    private readonly customerTemplateRepository: CustomerTemplateRepository,
    private readonly cmsService: CmsService,
  ) {}

  async store(
    customer: CustomerDocument,
    createCustomerTemplateDto: CreateCustomerTemplateDto,
  ): Promise<CustomerTemplateDocument> {
    const templateData: CreateTemplate = pick(createCustomerTemplateDto, [
      'name',
      'content',
      'subject',
      'bodyContent',
      'templateTitle',
      'imageUrl',
      'emailTemplate',
    ]);

    const strapiTemplate = await this.cmsService.createTemplate(
      customer,
      templateData,
    );

    return this.customerTemplateRepository.store({
      ...createCustomerTemplateDto,
      templateId: strapiTemplate.id,
    });
  }

  async findAllByCustomer(customer: CustomerDocument, page, perPage) {
    const filter: FilterQuery<CustomerTemplateDocument> = {
      customer: { $eq: customer._id },
    };
    const options: QueryOptions = {
      skip: page * perPage,
      sort: { createdAt: 'desc' },
    };
    return this.customerTemplateRepository.findAll(filter, options);
  }

  async listDropdown(customer: CustomerDocument) {
    const filters: FilterQuery<CustomerTemplateDocument> = {
      customer: { $eq: customer._id },
    };
    const options: QueryOptions = {
      sort: { name: 'asc' },
    };
    const projection: Projection<CustomerTemplateDocument> = {
      name: true,
      templateId: true,
    };
    return this.customerTemplateRepository.findAll(
      filters,
      options,
      projection,
    );
  }

  async findById(id: SchemaId): Promise<CustomerTemplateDocument> {
    return this.customerTemplateRepository.findById(id);
  }

  async update(
    id: SchemaId,
    updateCustomerTemplateDto: UpdateCustomerTemplateDto,
  ): Promise<CustomerTemplateDocument> {
    const { templateId } = await this.customerTemplateRepository.findById(id);
    const templateData = <Template>updateCustomerTemplateDto;
    await this.cmsService.updateTemplate(templateId, templateData);
    return this.customerTemplateRepository.update(
      id,
      updateCustomerTemplateDto,
    );
  }

  async remove(id: SchemaId): Promise<CustomerTemplateDocument> {
    const removed = await this.customerTemplateRepository.delete(id);
    await this.cmsService.deleteTemplate(removed.templateId);

    return removed;
  }
}
