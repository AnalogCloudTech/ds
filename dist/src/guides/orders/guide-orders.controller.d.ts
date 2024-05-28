/// <reference types="mongoose" />
import { GuideOrderDocument } from '@/guides/orders/schemas/guide-orders.schema';
import { GuideOrdersService } from '@/guides/orders/guide-orders.service';
import { CreateGuideOrderDto, UpdateGuideDto } from './dto/create-guide-order.dto';
import { SchemaId } from '@/internal/types/helpers';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Paginator, PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { BookOptionDocument } from '@/onboard/schemas/book-option.schema';
export declare class GuideOrdersController {
    private readonly service;
    constructor(service: GuideOrdersService);
    create(dto: CreateGuideOrderDto, customer: CustomerDocument): Promise<import("../../onboard/schemas/session.schema").SessionDocument | (import("mongoose").Document<unknown, any, import("@/guides/orders/schemas/guide-orders.schema").GuideOrders> & import("@/guides/orders/schemas/guide-orders.schema").GuideOrders & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })>;
    insertMany(orders: CreateGuideOrderDto[], sessionId: string, customer: CustomerDocument): Promise<import("../../onboard/schemas/session.schema").SessionDocument>;
    orders(customer: CustomerDocument, { page, perPage }: Paginator): Promise<PaginatorSchematicsInterface<GuideOrderDocument>>;
    guideDetails(guideId: string): Promise<BookOptionDocument>;
    getLatestOrder(customer: CustomerDocument, guideId: string): Promise<GuideOrderDocument>;
    find(id: SchemaId): Promise<GuideOrderDocument>;
    update(id: SchemaId, body: UpdateGuideDto): Promise<import("mongoose").Document<unknown, any, import("@/guides/orders/schemas/guide-orders.schema").GuideOrders> & import("@/guides/orders/schemas/guide-orders.schema").GuideOrders & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
