import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { SchemaId } from '@/internal/types/helpers';
import { ZoomRecordingDocument } from '@/legacy/dis/legacy/zoom/schemas/zoom.schema';
import { Model } from 'mongoose';
export declare class ZoomDsRepository extends GenericRepository<ZoomRecordingDocument> {
    protected readonly model: Model<ZoomRecordingDocument>;
    constructor(model: Model<ZoomRecordingDocument>);
    getUniqueHostMail(email?: string): Promise<string[]>;
    deleteManyRecords(data?: SchemaId[]): Promise<import("mongodb").UpdateResult>;
}
