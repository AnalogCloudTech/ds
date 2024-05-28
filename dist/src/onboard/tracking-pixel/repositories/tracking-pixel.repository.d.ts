import { TrackingPixelDocument } from '../schemas/tracking-pixel.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';
export declare class TrackingPixelRepository extends GenericRepository<TrackingPixelDocument> {
    protected readonly model: Model<TrackingPixelDocument>;
    constructor(model: Model<TrackingPixelDocument>);
}
