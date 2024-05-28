/// <reference types="mongoose" />
import { CustomerEventsRepository } from '@/customers/customer-events/repositories/customer-events.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerEventDocument } from '@/customers/customer-events/schemas/customer-events.schema';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CreateCustomerEventDto } from '@/customers/customer-events/dto/create-customer-event.dto';
export declare class CustomerEventsService {
    private readonly customerEventsRepository;
    constructor(customerEventsRepository: CustomerEventsRepository);
    createEvent(customer: CustomerDocument, dto: CreateCustomerEventDto): Promise<import("mongoose").Document<unknown, any, import("@/customers/customer-events/schemas/customer-events.schema").CustomerEvent> & import("@/customers/customer-events/schemas/customer-events.schema").CustomerEvent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllFromCustomer(customer: CustomerDocument, page: number, perPage: number): Promise<PaginatorSchematicsInterface<CustomerEventDocument>>;
    getAllByCustomerId(customerId: string, page: number, perPage: number): Promise<PaginatorSchematicsInterface<CustomerEventDocument>>;
}
