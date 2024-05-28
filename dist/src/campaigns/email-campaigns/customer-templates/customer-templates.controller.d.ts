/// <reference types="mongoose" />
import { CustomerTemplatesService } from './customer-templates.service';
import { CreateCustomerTemplateDto } from './dto/create-customer-template.dto';
import { UpdateCustomerTemplateDto } from './dto/update-customer-template.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Paginator } from '@/internal/utils/paginator';
import { SchemaId } from '@/internal/types/helpers';
export declare class CustomerTemplatesController {
    private readonly customerTemplatesService;
    constructor(customerTemplatesService: CustomerTemplatesService);
    create(customer: CustomerDocument, createCustomerTemplateDto: CreateCustomerTemplateDto): Promise<import("mongoose").Document<unknown, any, import("./schemas/customer-template.schema").CustomerTemplate> & import("./schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(customer: CustomerDocument, { page, perPage }: Paginator): Promise<(import("mongoose").Document<unknown, any, import("./schemas/customer-template.schema").CustomerTemplate> & import("./schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    listDropDown(customer: CustomerDocument): Promise<(import("mongoose").Document<unknown, any, import("./schemas/customer-template.schema").CustomerTemplate> & import("./schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(id: SchemaId): Promise<import("mongoose").Document<unknown, any, import("./schemas/customer-template.schema").CustomerTemplate> & import("./schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: SchemaId, updateCustomerTemplateDto: UpdateCustomerTemplateDto): Promise<import("mongoose").Document<unknown, any, import("./schemas/customer-template.schema").CustomerTemplate> & import("./schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: SchemaId): Promise<import("mongoose").Document<unknown, any, import("./schemas/customer-template.schema").CustomerTemplate> & import("./schemas/customer-template.schema").CustomerTemplate & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
