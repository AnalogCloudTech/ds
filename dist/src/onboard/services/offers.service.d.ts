import { OffersRepository } from '@/onboard/repositories/offers.repository';
import { FilterQuery, QueryOptions } from 'mongoose';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
export declare class OffersService {
    private readonly repository;
    constructor(repository: OffersRepository);
    findAll(filter?: FilterQuery<OfferDocument>, options?: QueryOptions): Promise<(import("mongoose").Document<unknown, any, import("@/onboard/schemas/offer.schema").Offer> & import("@/onboard/schemas/offer.schema").Offer & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
