import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { Magazine, MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { CreateMagazineStoreDto } from '@/referral-marketing/magazines/dto/create-magazine-store.dto';
import { ListMagazineDto } from '@/referral-marketing/magazines/dto/list-magazine.dto';
import { MagazineMetricsType, MagazineReportsType, RmMagazineFilterQuery, RmStatusFilterQuery } from '../domain/types';
import { SchemaId } from '@/internal/types/helpers';
import { UpdateMagazineStatusDto } from '../dto/update-magazine-status.dto';
export declare class MagazinesRepository {
    private readonly magazineModel;
    constructor(magazineModel: Model<MagazineDocument>);
    create({ customer, magazineId, year, month, baseReplacers, contentUrl, createdByAutomation, }: CreateMagazineStoreDto): Promise<MagazineDocument>;
    findOne(year: string, month: string, customerId?: SchemaId): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    find({ customer, month, year, page, perPage, sortOrder, status, }: ListMagazineDto): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    update(magazineId: SchemaId, updateQuery: UpdateQuery<Magazine>, options?: QueryOptions): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateStatusByMagazineId(id: string, { status }: UpdateMagazineStatusDto): Promise<MagazineDocument>;
    getMagazinesMetrics(page: number, perPage: number, skip: number, filterQuery: RmMagazineFilterQuery, pageVisits: RmStatusFilterQuery, sentToPrint: RmStatusFilterQuery, magazineGeneratedCount: number): Promise<{
        MagazinesDetails: import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>;
        PageVistedCount: number;
        MagazineGeneratedCount: number;
        SentToPrintCount: number;
    }>;
    getMagazineMetricsByStatus(page: number, perPage: number, skip: number, filterQuery: RmMagazineFilterQuery): Promise<{
        MagazinesDetails: import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>;
    }>;
    getAllMagazinesMetrics(filterQuery: RmMagazineFilterQuery): Promise<MagazineMetricsType[]>;
    getMagazinesMetricsBySearch(searchQuery: string, filterQuery: RmMagazineFilterQuery, page: number, perPage: number): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<MagazineReportsType>>;
    private cloneLastMagazineData;
    findAll(filter: FilterQuery<MagazineDocument>, projection?: any, options?: QueryOptions): Promise<MagazineDocument[]>;
    findMagazine(filter: FilterQuery<MagazineDocument>, projection?: {}, options?: QueryOptions): Promise<MagazineDocument>;
    updateOne(filter: FilterQuery<MagazineDocument>, updateQuery: UpdateQuery<MagazineDocument>, options: QueryOptions): Promise<import("mongodb").UpdateResult>;
    updateMany(filter: FilterQuery<MagazineDocument>, updateQuery: UpdateQuery<MagazineDocument>, options: QueryOptions): Promise<import("mongodb").UpdateResult>;
}
