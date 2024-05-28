/// <reference types="mongoose" />
import { CustomerEventsService } from './customer-events.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Paginator } from '@/internal/utils/paginator';
import { CreateCustomerEventDto } from '@/customers/customer-events/dto/create-customer-event.dto';
export declare class CustomerEventsController {
    private readonly customerEventsService;
    constructor(customerEventsService: CustomerEventsService);
    create(customer: CustomerDocument, dto: CreateCustomerEventDto): Promise<import("mongoose").Document<unknown, any, import("./schemas/customer-events.schema").CustomerEvent> & import("./schemas/customer-events.schema").CustomerEvent & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(customer: CustomerDocument, { page, perPage }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("./schemas/customer-events.schema").CustomerEvent> & import("./schemas/customer-events.schema").CustomerEvent & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findAllByCustomerId(customerId: string, { page, perPage }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("./schemas/customer-events.schema").CustomerEvent> & import("./schemas/customer-events.schema").CustomerEvent & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
