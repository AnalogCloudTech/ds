import { Logger } from '@nestjs/common';
import { CreateMagazineDto } from '../dto/create-magazine.dto';
import { UpdateMagazineDto } from '../dto/update-magazine.dto';
import { GetAllReportMetricsDto } from '../dto/get-all-report-metrics.dto';
import { CmsService } from '@/cms/cms/cms.service';
import { MagazinesRepository } from '@/referral-marketing/magazines/repositories/magazines.repository';
import { Cover, Selection } from '@/referral-marketing/magazines/domain/types';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { ListMagazineDto } from '@/referral-marketing/magazines/dto/list-magazine.dto';
import { Magazine, MagazineDocument } from '../schemas/magazine.schema';
import { TurnMonthDto } from '@/referral-marketing/magazines/dto/turn-month.dto';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { ReferralMarketingCoverDesignOption, ReferralMarketingMagazine } from '@/cms/cms/types/referral-marketing-magazine';
import { DataObject } from '@/cms/cms/types/common';
import { MonthsType } from '@/internal/utils/date';
import { UpdateMagazineStatusDto } from '../dto/update-magazine-status.dto';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { SchemaId } from '@/internal/types/helpers';
import { CreateMagazineStoreDto } from '@/referral-marketing/magazines/dto/create-magazine-store.dto';
export declare class MagazinesService {
    private readonly generatedMagazinesService;
    private readonly magazinesRepository;
    private readonly cmsService;
    private readonly logger;
    constructor(generatedMagazinesService: GeneratedMagazinesService, magazinesRepository: MagazinesRepository, cmsService: CmsService, logger: Logger);
    first(filter: FilterQuery<MagazineDocument>, options?: QueryOptions): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    find(filter: FilterQuery<MagazineDocument>, options?: QueryOptions): Promise<(import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    create(customer: CustomerDocument, createMagazineDto: CreateMagazineDto): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(list: ListMagazineDto): Promise<(import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    updateMag(magazineId: SchemaId, update: Partial<Magazine>, options?: QueryOptions): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOne(customer: CustomerDocument, year: string, month: string): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(customer: CustomerDocument, year: string, month: string, updateMagazineDto: UpdateMagazineDto): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateStatusByMagazineId(id: string, dto: UpdateMagazineStatusDto): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMagazinePages(filters: {
        month: string;
        year: string;
    }): Promise<{
        id: number;
        month: string;
        year: string;
        pdf: string;
        previewPdf: string;
        frontCoverDesign: {
            displayImage: string;
            id: number;
            name: string;
            html: string;
            formKeyword: string;
            defaultText: string;
        }[];
        frontCoverStrip: {
            displayImage: string;
            id: number;
            name: string;
            html: string;
            formKeyword: string;
            defaultText: string;
        }[];
        frontInsideCover: {
            displayImage: string;
            id: number;
            name: string;
            html: string;
            formKeyword: string;
            defaultText: string;
        }[];
        backInsideCover: {
            displayImage: string;
            id: number;
            name: string;
            html: string;
            formKeyword: string;
            defaultText: string;
        }[];
        backCover: {
            displayImage: string;
            id: number;
            name: string;
            html: string;
            formKeyword: string;
            defaultText: string;
        }[];
    }>;
    processCover(selection: Selection, magazineInfo: DataObject<ReferralMarketingMagazine>): Promise<Cover>;
    private processMagazineData;
    getMagazinesMetrics(page: number, perPage: number, year: string, month: MonthsType): Promise<{
        MagazinesDetails: import("../../../internal/utils/paginator").PaginatorSchematicsInterface<any>;
        PageVistedCount: number;
        MagazineGeneratedCount: number;
        SentToPrintCount: number;
    }>;
    getMagazineEditingMetrics(page: number, perPage: number, year: string, month: string): Promise<{
        MagazinesDetails: import("../../../internal/utils/paginator").PaginatorSchematicsInterface<any>;
    }>;
    getMagazineSentToPrintMetrics(page: number, perPage: number, year: string, month: string): Promise<{
        MagazinesDetails: import("../../../internal/utils/paginator").PaginatorSchematicsInterface<any>;
    }>;
    getAllMagazinesMetrics({ year, month }: GetAllReportMetricsDto): Promise<import("@/referral-marketing/magazines/domain/types").MagazineMetricsType[]>;
    getMagazinesMetricsBySearch(searchQuery: string, year: string, month: string, page: number, perPage: number): Promise<import("../../../internal/utils/paginator").PaginatorSchematicsInterface<import("@/referral-marketing/magazines/domain/types").MagazineReportsType>>;
    getBaseReplacers(magazineId: SchemaId, customerId: SchemaId): Promise<import("@/referral-marketing/magazines/domain/types").Replacer[]>;
    private updateSelections;
    mapDisplayImageMagazine: (magazineData?: ReferralMarketingCoverDesignOption[]) => {
        displayImage: string;
        id: number;
        name: string;
        html: string;
        formKeyword: string;
        defaultText: string;
    }[];
    getMagazineCustomerWithoutMagazine({ lastData, currentData, }: TurnMonthDto): Promise<Magazine[]>;
    updateOne(filter: FilterQuery<MagazineDocument>, update: UpdateQuery<MagazineDocument>, options: QueryOptions): Promise<import("mongodb").UpdateResult>;
    updateMany(filter: FilterQuery<MagazineDocument>, update: UpdateQuery<MagazineDocument>, options: QueryOptions): Promise<import("mongodb").UpdateResult>;
    adminCreate(dto: CreateMagazineStoreDto): Promise<import("mongoose").Document<unknown, any, Magazine> & Magazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
