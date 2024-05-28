import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';
import { TripWireUpsell, TWUpsellDocument } from '@/onboard/upsell/schemas/tw-upsell.schema';
import { CreateUpsellReportDto } from '@/onboard/upsell/dto/create-upsell-report.dto';
export declare class TwUpsellRepository extends GenericRepository<TWUpsellDocument> {
    protected readonly model: Model<TWUpsellDocument>;
    constructor(model: Model<TWUpsellDocument>);
    findByIds(ids: string[]): import("mongoose").Query<(import("mongoose").Document<unknown, any, TripWireUpsell> & TripWireUpsell & {
        _id: import("mongoose").Types.ObjectId;
    } & import("mongoose").SchemaTimestampsConfig & {
        _id: import("mongoose").Types.ObjectId;
    })[], import("mongoose").Document<unknown, any, TripWireUpsell> & TripWireUpsell & {
        _id: import("mongoose").Types.ObjectId;
    } & import("mongoose").SchemaTimestampsConfig & {
        _id: import("mongoose").Types.ObjectId;
    }, {}, TWUpsellDocument>;
    storeMany(data: CreateUpsellReportDto[]): Promise<(import("mongoose").Document<unknown, any, TripWireUpsell> & TripWireUpsell & {
        _id: import("mongoose").Types.ObjectId;
    } & import("mongoose").SchemaTimestampsConfig & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
