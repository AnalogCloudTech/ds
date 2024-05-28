/// <reference types="mongoose" />
import { CustomersService } from './customers.service';
import { Customer } from './domain/customer';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerFlippingBookPreferences } from '@/customers/customers/dto/update-customer.dto';
import { CustomerDocument, LandingPageWebsite } from '@/customers/customers/schemas/customer.schema';
import { UpdateAvatarDto } from '@/customers/customers/dto/update-avatar.dto';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { FindCustomerByNameOrEmailDto } from '@/customers/customers/dto/find-customer-by-name-or-email.dto';
import { Paginator } from '@/internal/utils/paginator';
export declare class CustomersController {
    private readonly customersService;
    private readonly hubspotService;
    constructor(customersService: CustomersService, hubspotService: HubspotService);
    getAllCustomers({ page, perPage }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("@/customers/customers/schemas/customer.schema").Customer> & import("@/customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getCustomer(customer: CustomerDocument): import("mongoose").Document<unknown, any, import("@/customers/customers/schemas/customer.schema").Customer> & import("@/customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    };
    register(registerCustomer: CreateCustomerDto): Promise<Customer>;
    update(customer: CustomerDocument, updateProperties: Partial<CustomerDocument>): Promise<import("mongoose").Document<unknown, any, import("@/customers/customers/schemas/customer.schema").Customer> & import("@/customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    publicUpdateAvatar({ email, avatar }: UpdateAvatarDto): Promise<{
        status: boolean;
    }>;
    updateFlippingBookPreferences(id: string, flippingBookPreferences: UpdateCustomerFlippingBookPreferences): Promise<void>;
    findCustomerByTerm(dto: FindCustomerByNameOrEmailDto): Promise<Partial<import("mongoose").Document<unknown, any, import("@/customers/customers/schemas/customer.schema").Customer> & import("@/customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>[]>;
    addLandingPageWebsite(customer: CustomerDocument, body: LandingPageWebsite): Promise<import("mongoose").Document<unknown, any, import("@/customers/customers/schemas/customer.schema").Customer> & import("@/customers/customers/schemas/customer.schema").Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getLandingPageWebsite(customer: CustomerDocument, id: string): Promise<LandingPageWebsite>;
}
