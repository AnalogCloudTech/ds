import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { OfferDocument } from '@/onboard/schemas/offer.schema';
import { Model } from 'mongoose';
export declare class OffersRepository extends GenericRepository<OfferDocument> {
    protected readonly model: Model<OfferDocument>;
    constructor(model: Model<OfferDocument>);
}
