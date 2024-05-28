/// <reference types="mongoose" />
import { UpdateCustomerTemplateDto } from '@/campaigns/email-campaigns/customer-templates/dto/update-customer-template.dto';
import { CreateCustomerTemplateDto } from '@/campaigns/email-campaigns/customer-templates/dto/create-customer-template.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerTemplateRepository } from '@/campaigns/email-campaigns/customer-templates/repositories/customer-template.repository';
import { CmsService } from '@/cms/cms/cms.service';
import { CustomerTemplateDocument } from '@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema';
import { SchemaId } from '@/internal/types/helpers';
export declare class CustomerTemplatesService {
    private readonly customerTemplateRepository;
    private readonly cmsService;
    constructor(customerTemplateRepository: CustomerTemplateRepository, cmsService: CmsService);
    store(customer: CustomerDocument, createCustomerTemplateDto: CreateCustomerTemplateDto): Promise<CustomerTemplateDocument>;
    findAllByCustomer(customer: CustomerDocument, page: any, perPage: any): Promise<(import("mongoose").Document<unknown, any, import("@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema").CustomerTemplate> & import("@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    listDropdown(customer: CustomerDocument): Promise<(import("mongoose").Document<unknown, any, import("@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema").CustomerTemplate> & import("@/campaigns/email-campaigns/customer-templates/schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findById(id: SchemaId): Promise<CustomerTemplateDocument>;
    update(id: SchemaId, updateCustomerTemplateDto: UpdateCustomerTemplateDto): Promise<CustomerTemplateDocument>;
    remove(id: SchemaId): Promise<CustomerTemplateDocument>;
}
