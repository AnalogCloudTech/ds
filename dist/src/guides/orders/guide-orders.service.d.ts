import { Types } from 'mongoose';
import { CreateGuideOrderDto, UpdateGuideDto } from './dto/create-guide-order.dto';
import { GuideOrderDocument } from './schemas/guide-orders.schema';
import { SchemaId } from '@/internal/types/helpers';
import { GuideOrdersRepository } from '@/guides/orders/repositories/guide-orders.repository';
import { OnboardService } from '@/onboard/onboard.service';
import { SessionService } from '@/onboard/services/session.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { BookOptionDocument } from '@/onboard/schemas/book-option.schema';
import { GuideCatalogService } from '@/guides/catalog/guide-catalog.service';
export declare class GuideOrdersService {
    private readonly repository;
    private readonly onboardService;
    private readonly sessionService;
    private readonly hubspotService;
    private readonly guideCatalogService;
    constructor(repository: GuideOrdersRepository, onboardService: OnboardService, sessionService: SessionService, hubspotService: HubspotService, guideCatalogService: GuideCatalogService);
    getOrderId(count: number): string;
    create(dto: CreateGuideOrderDto, customer: CustomerDocument): Promise<import("../../onboard/schemas/session.schema").SessionDocument | (import("mongoose").Document<unknown, any, import("./schemas/guide-orders.schema").GuideOrders> & import("./schemas/guide-orders.schema").GuideOrders & {
        _id: Types.ObjectId;
    } & {
        _id: Types.ObjectId;
    })>;
    insertMany(dto: CreateGuideOrderDto[], sessionId: string, customer: CustomerDocument): Promise<import("../../onboard/schemas/session.schema").SessionDocument>;
    find(id: SchemaId): Promise<GuideOrderDocument>;
    orders(customerId: SchemaId, page: number, perPage: number): Promise<PaginatorSchematicsInterface<GuideOrderDocument>>;
    guideDetails(guideId: string): Promise<BookOptionDocument>;
    getLatestOrder(customerId: SchemaId, guideId: string): Promise<GuideOrderDocument>;
    remove(id: Types.ObjectId): Promise<GuideOrderDocument>;
    update(id: SchemaId, dto: UpdateGuideDto): Promise<GuideOrderDocument>;
}
