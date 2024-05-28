import { SessionRepository } from '@/onboard/repositories/session.repository';
import { SessionDocument } from '@/onboard/schemas/session.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { SchemaId } from '@/internal/types/helpers';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { MarketingParameters, SalesParameters, SessionCustomerHubspot, Step } from '@/onboard/domain/types';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
export declare class SessionService {
    private readonly repository;
    constructor(repository: SessionRepository);
    pushDeclinedCoach(session: SessionDocument, coach: CoachDocument): Promise<SessionDocument>;
    getSessionsToUpdateCustomerLastStepHubspot(filter: FilterQuery<SessionDocument>): Promise<Array<SessionCustomerHubspot>>;
    startSessionForUpSell(offer: OfferDocument, currentStep: Step, customer: CustomerDocument, marketingParameters?: MarketingParameters, salesParameters?: SalesParameters): Promise<SessionDocument>;
    findById(id: SchemaId, options?: QueryOptions): Promise<SessionDocument>;
    update(id: SchemaId, update: UpdateQuery<SessionDocument>): Promise<SessionDocument>;
    onboardSalesReport(match?: FilterQuery<SessionDocument>, skip?: number, perPage?: number): Promise<any[]>;
    onboardSalesReportCount(match?: FilterQuery<SessionDocument>): Promise<number>;
}
