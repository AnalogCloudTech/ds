import { CustomerPropertiesService } from '@/customers/customer-properties/customer-properties.service';
import { CreateCustomerPropertiesDto } from '@/customers/customer-properties/dto/create-customer-properties.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { UpdateCustomerPropertiesDto } from '@/customers/customer-properties/dto/update-customer-properties.dto';
import { FilterQuery } from 'mongoose';
import { CustomerPropertiesDocument } from '@/customers/customer-properties/schemas/customer-properties.schemas';
export declare class CustomerPropertiesController {
    private readonly service;
    constructor(service: CustomerPropertiesService);
    findAll(filter: FilterQuery<CustomerPropertiesDocument>): Promise<(import("mongoose").Document<unknown, any, import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties> & import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(dto: CreateCustomerPropertiesDto, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties> & import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, customer: CustomerDocument, dto: UpdateCustomerPropertiesDto): Promise<import("mongoose").Document<unknown, any, import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties> & import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOneById(id: string): Promise<import("mongoose").Document<unknown, any, import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties> & import("@/customers/customer-properties/schemas/customer-properties.schemas").CustomerProperties & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
