/// <reference types="mongoose" />
import { GuideCatalogRepository } from '@/guides/catalog/repositories/guide-catalog.repository';
import { CreateGuideCatalogDto } from '@/guides/catalog/dto/create-guide-catalog.dto';
export declare class GuideCatalogService {
    private readonly repository;
    constructor(repository: GuideCatalogRepository);
    create(dto: CreateGuideCatalogDto): Promise<import("mongoose").Document<unknown, any, import("./schemas/guide-catalog.schema").GuideCatalog> & import("./schemas/guide-catalog.schema").GuideCatalog & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, any, import("./schemas/guide-catalog.schema").GuideCatalog> & import("./schemas/guide-catalog.schema").GuideCatalog & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(guideId: string): Promise<import("mongoose").Document<unknown, any, import("./schemas/guide-catalog.schema").GuideCatalog> & import("./schemas/guide-catalog.schema").GuideCatalog & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
