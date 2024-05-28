/// <reference types="mongoose" />
import { MagazinesService } from '../services/magazines.service';
import { CreateMagazineDto } from '@/referral-marketing/magazines/dto/create-magazine.dto';
import { UpdateMagazineDto } from '@/referral-marketing/magazines/dto/update-magazine.dto';
import { GetAllReportMetricsDto } from '@/referral-marketing/magazines/dto/get-all-report-metrics.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Paginator } from '@/internal/utils/paginator';
import { ReportMagazinesDto } from '../dto/report-magazines';
import { UpdateMagazineStatusDto } from '../dto/update-magazine-status.dto';
import { ListMagazineDto } from '../dto/list-magazine.dto';
export declare class MagazinesController {
    private readonly magazinesService;
    constructor(magazinesService: MagazinesService);
    create(dto: CreateMagazineDto, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/magazine.schema").Magazine> & import("../schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMagazineData(month: string, year: string): Promise<any>;
    findAll(list: ListMagazineDto, customer: CustomerDocument): Promise<(import("mongoose").Document<unknown, any, import("../schemas/magazine.schema").Magazine> & import("../schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getMagazineEditingMetrics({ page, perPage }: Paginator, { year, month }: ReportMagazinesDto): Promise<{
        MagazinesDetails: import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>;
    }>;
    getMagazineSentToPrintMetrics({ page, perPage }: Paginator, { year, month }: ReportMagazinesDto): Promise<{
        MagazinesDetails: import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>;
    }>;
    getAllMagazinesMetrics(dto: GetAllReportMetricsDto): Promise<import("../domain/types").MagazineMetricsType[]>;
    findOne(year: string, month: string, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/magazine.schema").Magazine> & import("../schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateMagazineStatus(id: string, dto: UpdateMagazineStatusDto): Promise<import("mongoose").Document<unknown, any, import("../schemas/magazine.schema").Magazine> & import("../schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    patch(year: string, month: string, dto: UpdateMagazineDto, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/magazine.schema").Magazine> & import("../schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMagazinesMetrics({ page, perPage }: Paginator, { year, month }: ReportMagazinesDto): Promise<{
        MagazinesDetails: import("@/internal/utils/paginator").PaginatorSchematicsInterface<any>;
        PageVistedCount: number;
        MagazineGeneratedCount: number;
        SentToPrintCount: number;
    }>;
    getMagazinesMetricsBySearch({ page, perPage }: Paginator, { searchQuery, year, month }: ReportMagazinesDto): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("../domain/types").MagazineReportsType>>;
}
