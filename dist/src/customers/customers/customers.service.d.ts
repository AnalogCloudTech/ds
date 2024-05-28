import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { Logger } from '@nestjs/common';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { DisService } from '@/legacy/dis/dis.service';
import { CustomersRepository } from '@/customers/customers/customers.repository';
import { UpdateCustomerFlippingBookPreferences } from '@/customers/customers/dto/update-customer.dto';
import { CustomersSubscriptionsRepository } from '@/customers/customers/customers-subscriptions.repository';
import { CustomerSubscriptionDocument } from '@/customers/customers/schemas/customer-subscription.schema';
import { UnsubscriptionReportDto } from '@/customers/customers/dto/unsubscription-report.dto';
import { CustomerId, Status } from './domain/types';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateBookPreferencesDto } from './dto/update-book-preferences.dto';
import { Customer, CustomerDocument, LandingPageWebsite } from './schemas/customer.schema';
import { UpdateLandingPageProfileDto } from './dto/update-landing-page-profile.dto';
import { CreateAttributesDto } from './dto/attributesDto';
export declare class CustomersService {
    private model;
    private readonly disService;
    private readonly customersRepository;
    private readonly customerSubscriptionRepository;
    private readonly logger;
    constructor(model: Model<CustomerDocument>, disService: DisService, customersRepository: CustomersRepository, customerSubscriptionRepository: CustomersSubscriptionsRepository, logger: Logger);
    findAll(filter?: FilterQuery<CustomerDocument>, options?: QueryOptions): Promise<(import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getAllCustomers(page?: number, perPage?: number): Promise<PaginatorSchematicsInterface<CustomerDocument>>;
    create(dto: CreateCustomerDto): Promise<CustomerDocument>;
    syncCustomer(dto: CreateCustomerDto, status: Status, customerEntity?: CustomerDocument): Promise<CustomerDocument>;
    findByEmail(email: string): Promise<CustomerDocument>;
    landingPageDetailsByEmail(hubSpotEmails: string[]): Promise<(import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findByIdentities(identities: Array<string>): Promise<CustomerDocument>;
    findById(id: CustomerId): Promise<CustomerDocument>;
    findOne(filter: FilterQuery<CustomerDocument>, options?: QueryOptions): Promise<CustomerDocument>;
    authenticate(email: string, password: string): Promise<boolean>;
    saveLandingPageProfile(id: CustomerId, dto: UpdateLandingPageProfileDto): Promise<CustomerDocument>;
    saveCampaignAttributes(id: CustomerId, dto: CreateAttributesDto | null): Promise<CustomerDocument>;
    deleteAttribute(id: CustomerId): Promise<import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    saveOnboardBookPreferences(id: CustomerId, preferences: UpdateBookPreferencesDto): Promise<CustomerDocument>;
    private isMissingDependencies;
    updateFlippingBookPreferences(id: string, dto: UpdateCustomerFlippingBookPreferences): Promise<import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createSubscriptionorUnsubscription(customerId: string, subscriptionId: string, status: string, previousState: string): Promise<CustomerSubscriptionDocument>;
    unsubscriptionReport(dto: UnsubscriptionReportDto): Promise<Array<CustomerSubscriptionDocument>>;
    update(customer: CustomerDocument, dto: Partial<CustomerDocument>): Promise<import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    publicUpdate(email: string, avatar: string): Promise<import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    listByNameOrEmail(nameOrEmail: string): Promise<Array<Partial<CustomerDocument>> | null>;
    unsubscribeSMSRemindersByPhoneNumber(phone: string): Promise<CustomerDocument | null>;
    acceptedReceiveSMSScheduleCoachReminders(customer: CustomerDocument): boolean;
    addLandingPageWebsite(customerId: string, dto: LandingPageWebsite): Promise<import("mongoose").Document<unknown, any, Customer> & Customer & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getLandingPageWebsite(customerEmail: string, id: string): Promise<LandingPageWebsite>;
}
