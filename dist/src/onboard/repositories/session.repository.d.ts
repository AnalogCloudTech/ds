import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Session, SessionDocument } from '@/onboard/schemas/session.schema';
import { FilterQuery, Model } from 'mongoose';
import { SessionCustomerHubspot } from '@/onboard/domain/types';
export declare class SessionRepository extends GenericRepository<SessionDocument> {
    protected readonly model: Model<SessionDocument>;
    constructor(model: Model<SessionDocument>);
    getSessionsToUpdateCustomerLastStepHubspot(filter: FilterQuery<SessionDocument>): Promise<Array<SessionCustomerHubspot>>;
    onboardSalesReport(match: FilterQuery<SessionDocument>, skip: number, perPage: number): import("mongoose").Aggregate<any[]>;
    onboardSalesReportCount(match?: FilterQuery<SessionDocument>): import("mongoose").Query<number, Session & import("mongoose").Document<any, any, any> & {
        _id: any;
    }, {}, SessionDocument>;
}
