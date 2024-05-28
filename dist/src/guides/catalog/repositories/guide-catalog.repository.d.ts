import { GuideCatalogDocument } from '@/guides/catalog/schemas/guide-catalog.schema';
import { GenericRepository } from '@/internal/common/repository/generic.repository';
import { Model } from 'mongoose';
export declare class GuideCatalogRepository extends GenericRepository<GuideCatalogDocument> {
    protected readonly model: Model<GuideCatalogDocument>;
    constructor(model: Model<GuideCatalogDocument>);
}
