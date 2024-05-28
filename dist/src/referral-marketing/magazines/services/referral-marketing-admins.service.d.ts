/// <reference types="mongoose" />
import { Logger } from '@nestjs/common';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import { MagazinesService } from '@/referral-marketing/magazines/services/magazines.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { CmsService } from '@/cms/cms/cms.service';
import { UploadCustomMagazineDto } from '@/referral-marketing/magazines/dto/upload-custom-magazine.dto';
import { Queue } from 'bull';
import { CurrentMagazineMonthDate } from '@/referral-marketing/magazines/dto/turn-month.dto';
import { UpdateMagazineAdminDto } from '@/referral-marketing/magazines/dto/update-magazine-admin.dto';
import { UpdateMagazinesAdminDto } from '../dto/update-magazines-admin.dto';
import { CreateGeneratedMagazineDto } from '../dto/create-generated-magazine.dto';
import { UpdateMagazineDto } from '../dto/update-magazine.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { GeneratedMagazinesRepository } from '../repositories/generated-magazines.repository';
import { HubspotService } from '@/legacy/dis/legacy/hubspot/hubspot.service';
import { MagazinesRepository } from '../repositories/magazines.repository';
import { CustomerId } from '@/customers/customers/domain/types';
interface TurnMonthDto {
    currentData: {
        year: string;
        month: string;
    };
    lastData: {
        year: string;
        month: string;
    };
}
export declare class ReferralMarketingAdminsService {
    private readonly generatedMagazinesService;
    private readonly magazinesService;
    private readonly customersService;
    private readonly hubSpotService;
    private readonly generatedMagazinesRepository;
    private readonly magazinesRepository;
    private readonly cmsService;
    private readonly logger;
    private magazineQueue;
    private permanentLinkQueue;
    constructor(generatedMagazinesService: GeneratedMagazinesService, magazinesService: MagazinesService, customersService: CustomersService, hubSpotService: HubspotService, generatedMagazinesRepository: GeneratedMagazinesRepository, magazinesRepository: MagazinesRepository, cmsService: CmsService, logger: Logger, magazineQueue: Queue, permanentLinkQueue: Queue);
    generateMagazine(dto: CreateGeneratedMagazineDto, createTicket?: boolean, isPreview?: boolean, customerEmail?: string, customerId?: CustomerId): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    uploadCustomCover(dto: UploadCustomMagazineDto): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getGeneratedMagazine(customerId: CustomerId, year: string, month: string): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMagazine(customerId: CustomerId, year: string, month: string): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/magazine.schema").Magazine> & import("@/referral-marketing/magazines/schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateMagazine(customerId: CustomerId, year: string, month: string, dto: UpdateMagazineDto): Promise<import("mongoose").Document<unknown, any, import("@/referral-marketing/magazines/schemas/magazine.schema").Magazine> & import("@/referral-marketing/magazines/schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createTicket(generatedMagazineId: string, customerId: CustomerId, adminUser: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    scheduleMonthlyTurnOver(dto: TurnMonthDto): Promise<{
        message: string;
        jobs: number;
    }>;
    getMonthlyTurnOverQueueCount(): Promise<{
        count: number;
        active: number;
        failed: number;
    }>;
    manySendForPrinting({ month, year }: UpdateMagazinesAdminDto): Promise<import("mongodb").UpdateResult>;
    singleSendForPrinting({ month, year, customer, }: UpdateMagazineAdminDto): Promise<import("mongodb").UpdateResult>;
    schedulePermanentLinksTurnOver({ month, year, }: CurrentMagazineMonthDate): Promise<{
        message: string;
        jobs: number;
    }>;
    getPermanentQueueCount(): Promise<{
        count: number;
        active: number;
        failed: number;
    }>;
}
export {};
