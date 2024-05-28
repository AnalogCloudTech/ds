import { FilterQuery, Model, QueryOptions, Types } from 'mongoose';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { GeneratedMagazine, GeneratedMagazineDocument } from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { MagazineDocument } from '@/referral-marketing/magazines/schemas/magazine.schema';
import { UpdateGeneratedMagazineStatusDto } from '@/referral-marketing/magazines/dto/update-generated-magazine-status.dto';
import { MagazineIds, MagazinePreviewType } from '../domain/types';
import { PreviewMagazineDto } from '../dto/preview-magazine.dto';
import { LeadCoversDto } from '../dto/create-magazine-cover-lead.dto';
export declare class GeneratedMagazinesRepository {
    private readonly generatedMagazineModel;
    constructor(generatedMagazineModel: Model<GeneratedMagazine>);
    findGM(filter: FilterQuery<GeneratedMagazineDocument>, options: QueryOptions): Promise<(import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    })[]>;
    findOneGM(filter: FilterQuery<GeneratedMagazineDocument>, options: QueryOptions): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    }>;
    updateGM(where: FilterQuery<GeneratedMagazineDocument>, update: Partial<GeneratedMagazine>, options?: QueryOptions): Promise<GeneratedMagazineDocument>;
    count(magazineIds: MagazineIds[]): Promise<number>;
    create(customer: CustomerDocument, magazine: MagazineDocument, isPreview?: boolean, createdByAutomation?: boolean): Promise<GeneratedMagazineDocument>;
    upsert(customer: CustomerDocument, magazine: MagazineDocument, isPreview?: boolean, createdByAutomation?: boolean): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    }>;
    find(customer: CustomerDocument, active?: boolean): Promise<(import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    })[]>;
    findById(generatedMagazineId: string, customer?: CustomerDocument): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    }>;
    findOne(customer: CustomerDocument, magazine: MagazineDocument): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    }>;
    getMagazinePreview({ id, email, year, month, }: PreviewMagazineDto): Promise<MagazinePreviewType>;
    getAllGeneratedMagazinesMetrics(page: number, perPage: number, skip: number, filterQuery: FilterQuery<GeneratedMagazineDocument>): Promise<PaginatorSchematicsInterface<MagazinePreviewType>>;
    getCountAllGeneratedMagazinesMetrics(filterQuery: FilterQuery<GeneratedMagazineDocument>): Promise<number>;
    update(customer: CustomerDocument, generatedMagazineData: Partial<GeneratedMagazine>, magazine: MagazineDocument): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    }>;
    updateById(generatedMagazineId: string, { status, url, flippingBookUrl, coverImageHtml, pageUrl, pageStatus, bookUrl, coversOnlyUrl, }: UpdateGeneratedMagazineStatusDto): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: Types.ObjectId;
    }>;
    updateLeadCoversById(generatedMagazineId: string, dto: LeadCoversDto): Promise<GeneratedMagazineDocument>;
    private cloneLastGeneratedMagazineData;
    findByMagazineId(generatedMagazineId: string): Promise<GeneratedMagazineDocument>;
}
