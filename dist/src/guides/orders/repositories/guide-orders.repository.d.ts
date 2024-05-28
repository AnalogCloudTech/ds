import { GuideOrders, GuideOrderDocument } from '@/guides/orders/schemas/guide-orders.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';
import { CreateGuideOrderDto } from '@/guides/orders/dto/create-guide-order.dto';
import { SchemaId } from '@/internal/types/helpers';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
export declare class GuideOrdersRepository extends GenericRepository<GuideOrderDocument> {
    protected readonly model: Model<GuideOrderDocument>;
    constructor(model: Model<GuideOrderDocument>);
    create(dto: CreateGuideOrderDto, customerId: SchemaId): Promise<import("mongoose").Document<unknown, any, GuideOrders> & GuideOrders & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    count(): Promise<number>;
    getLatestOrder(customerId: SchemaId, guideId: string): Promise<GuideOrderDocument>;
    insertMany(dto: CreateGuideOrderDto[]): Promise<(import("mongoose").Document<unknown, any, GuideOrders> & GuideOrders & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findByCustomerId(customerId: SchemaId, page: number, perPage: number): Promise<PaginatorSchematicsInterface<GuideOrderDocument>>;
}
