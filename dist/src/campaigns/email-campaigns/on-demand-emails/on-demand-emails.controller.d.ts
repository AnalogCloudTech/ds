/// <reference types="mongoose" />
import { OnDemandEmailsService } from './on-demand-emails.service';
import { CreateOnDemandEmailDto } from './dto/create-on-demand-email.dto';
import { UpdateOnDemandEmailDto } from './dto/update-on-demand-email.dto';
import { Paginator } from '@/internal/utils/paginator';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class OnDemandEmailsController {
    private readonly onDemandEmailsService;
    constructor(onDemandEmailsService: OnDemandEmailsService);
    create(customer: CustomerDocument, createOnDemandEmailDto: CreateOnDemandEmailDto): Promise<import("mongoose").Document<unknown, any, import("./schemas/on-demand-email.schema").OnDemandEmail> & import("./schemas/on-demand-email.schema").OnDemandEmail & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(customer: CustomerDocument, { page, perPage }: Paginator): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>>;
    findOne(customer: CustomerDocument, id: string): Promise<import("mongoose").Document<unknown, any, import("./schemas/on-demand-email.schema").OnDemandEmail> & import("./schemas/on-demand-email.schema").OnDemandEmail & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: string, updateOnDemandEmailDto: UpdateOnDemandEmailDto): Promise<import("mongoose").Document<unknown, any, import("./schemas/on-demand-email.schema").OnDemandEmail> & import("./schemas/on-demand-email.schema").OnDemandEmail & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: string): Promise<import("./schemas/on-demand-email.schema").OnDemandEmail>;
}
