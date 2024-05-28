/// <reference types="mongoose" />
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { Attributes } from '@/customers/customers/domain/attributes';
import { CustomerId } from '@/customers/customers/domain/types';
import { CreateAttributesDto } from '@/customers/customers/dto/attributesDto';
export declare class CampaignAttributesService {
    private readonly customerService;
    private readonly sesService;
    constructor(customerService: CustomersService, sesService: SesService);
    create(id: any, createAttributeDto: CreateAttributesDto): Promise<import("mongoose").Document<unknown, any, import("../../../customers/customers/schemas/customer.schema").Customer> & import("../../../customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOne(id: CustomerId): Promise<Attributes>;
    remove(id: CustomerId): Promise<import("mongoose").Document<unknown, any, import("../../../customers/customers/schemas/customer.schema").Customer> & import("../../../customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
