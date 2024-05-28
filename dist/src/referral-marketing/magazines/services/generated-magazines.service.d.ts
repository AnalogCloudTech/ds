import { Logger } from '@nestjs/common';
import { MonthsType } from '@/internal/utils/date';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { GeneratedMagazinesRepository } from '@/referral-marketing/magazines/repositories/generated-magazines.repository';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { CreateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/create-generated-magazine.dto';
import { SnsService } from '@/internal/libs/aws/sns/sns.service';
import { ConfigService } from '@nestjs/config';
import { UpdateGeneratedMagazineStatusDto } from '@/referral-marketing/magazines/dto/update-generated-magazine-status.dto';
import { UpdateGeneratedMagazineDto } from '@/referral-marketing/magazines/dto/update-generated-magazine.dto';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { GeneratedMagazine, GeneratedMagazineDocument } from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import { MagazinesRepository } from '@/referral-marketing/magazines/repositories/magazines.repository';
import { PreviewMagazineDto } from '../dto/preview-magazine.dto';
import { FilterQuery, QueryOptions } from 'mongoose';
import { MagazineIds } from '../domain/types';
import { CustomersService } from '@/customers/customers/customers.service';
import { CmsService } from '@/cms/cms/cms.service';
import { CreateMagazineCoverLeadDto, LeadCoversDto, LeadDto } from '../dto/create-magazine-cover-lead.dto';
export declare class GeneratedMagazinesService {
    private readonly magazinesService;
    private readonly generatedMagazinesRepository;
    private readonly magazinesRepository;
    private readonly snsService;
    private readonly configService;
    private readonly hubSpotService;
    private readonly cmsService;
    private readonly customerService;
    private readonly logger;
    constructor(magazinesService: MagazinesService, generatedMagazinesRepository: GeneratedMagazinesRepository, magazinesRepository: MagazinesRepository, snsService: SnsService, configService: ConfigService, hubSpotService: HubspotService, cmsService: CmsService, customerService: CustomersService, logger: Logger);
    find(filter: FilterQuery<GeneratedMagazineDocument>, options?: QueryOptions): Promise<(import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOneGM(filter: FilterQuery<GeneratedMagazineDocument>, options?: QueryOptions): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateGM(filter: FilterQuery<GeneratedMagazineDocument>, update: Partial<GeneratedMagazine>, options?: QueryOptions): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    create(customer: CustomerDocument, { year, month, createdByAutomation }: CreateGeneratedMagazineDto, isPreview?: boolean, createTicket?: boolean): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createMagazineCoverForLeads(dto: CreateMagazineCoverLeadDto): Promise<LeadDto[]>;
    generateMagazineCoverForLead(lead: LeadDto, dto: CreateMagazineCoverLeadDto, customer: CustomerDocument): Promise<LeadDto>;
    findAll(customer: CustomerDocument, isActive?: boolean): Promise<(import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(customer: CustomerDocument, year: string, month: string): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(customer: CustomerDocument, { flippingBookUrl, pageUrl, bookUrl, additionalInformation, }: UpdateGeneratedMagazineDto, year: string, month: string): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateLeadCoversForMagazine(generatedMagazineId: string, dto: LeadCoversDto): Promise<GeneratedMagazineDocument>;
    updateStatus(generatedMagazineId: string, dto: UpdateGeneratedMagazineStatusDto): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getGeneratedMagazineStatusById(generatedMagazineId: string): Promise<GeneratedMagazineDocument>;
    sendToPrint(generatedMagazineId: string, _customer?: CustomerDocument): Promise<import("mongoose").Document<unknown, any, GeneratedMagazine> & GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMagazinePreview(dto: PreviewMagazineDto): Promise<import("../domain/types").MagazinePreviewType>;
    count(magazineIds: MagazineIds[]): Promise<number>;
    getAllGeneratedMagazinesMetrics(page: number, perPage: number, year: string, month: string): Promise<import("../../../internal/utils/paginator").PaginatorSchematicsInterface<import("../domain/types").MagazinePreviewType>>;
    getCountAllGeneratedMagazinesMetrics(year: string, month: MonthsType): Promise<number>;
}
