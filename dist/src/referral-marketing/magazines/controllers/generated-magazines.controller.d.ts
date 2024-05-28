/// <reference types="mongoose" />
import { Logger } from '@nestjs/common';
import { Paginator } from '@/internal/utils/paginator';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CreateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/create-generated-magazine.dto';
import { UpdateGeneratedMagazineStatusDto } from '@/referral-marketing/magazines/dto/update-generated-magazine-status.dto';
import { GetAllReportMetricsDto } from '@/referral-marketing/magazines/dto/get-all-report-metrics.dto';
import { UpdateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/update-generated-magazine.dto';
import { PreviewMagazineDto } from '../dto/preview-magazine.dto';
import { CreateMagazineCoverLeadDto, LeadCoversDto, LeadDto } from '../dto/create-magazine-cover-lead.dto';
import { GeneratedMagazineDocument } from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
export declare class GeneratedMagazinesController {
    private readonly generatedMagazinesService;
    private readonly logger;
    constructor(generatedMagazinesService: GeneratedMagazinesService, logger: Logger);
    create(isPreview: boolean, dto: CreateGeneratedMagazineDto, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine> & import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createMagazineCoverForLead(dto: CreateMagazineCoverLeadDto): Promise<LeadDto[]>;
    findAll(customer: CustomerDocument): Promise<(import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine> & import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    getAllGeneratedMagazinesMetrics({ page, perPage }: Paginator, { year, month }: GetAllReportMetricsDto): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("../domain/types").MagazinePreviewType>>;
    getCountAllGeneratedMagazinesMetrics({ year, month }: GetAllReportMetricsDto): Promise<number>;
    find(year: string, month: string, customer: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine> & import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(customer: CustomerDocument, year: string, month: string, dto: UpdateGeneratedMagazineDto): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine> & import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    sendToPrint(customer: CustomerDocument, id: string): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine> & import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    apiSendToPrint(id: string): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine> & import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateStatus(id: string, dto: UpdateGeneratedMagazineStatusDto): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine> & import("@/referral-marketing/magazines/schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateLeadcoversForMagazine(magazineId: string, dto: LeadCoversDto): Promise<GeneratedMagazineDocument>;
    getMagazinePreview(dto: PreviewMagazineDto): Promise<import("../domain/types").MagazinePreviewType>;
    getGeneratedMagazineStatusById(id: string): Promise<GeneratedMagazineDocument>;
}
