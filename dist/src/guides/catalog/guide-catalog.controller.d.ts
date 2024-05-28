/// <reference types="mongoose" />
import { GuideCatalogService } from '@/guides/catalog/guide-catalog.service';
import { CreateGuideCatalogDto } from '@/guides/catalog/dto/create-guide-catalog.dto';
export declare class GuideCatalogController {
    private readonly service;
    constructor(service: GuideCatalogService);
    create(dto: CreateGuideCatalogDto): Promise<import("mongoose").Document<unknown, any, import("./schemas/guide-catalog.schema").GuideCatalog> & import("./schemas/guide-catalog.schema").GuideCatalog & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, any, import("./schemas/guide-catalog.schema").GuideCatalog> & import("./schemas/guide-catalog.schema").GuideCatalog & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    find(guideId: string): Promise<import("mongoose").Document<unknown, any, import("./schemas/guide-catalog.schema").GuideCatalog> & import("./schemas/guide-catalog.schema").GuideCatalog & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
