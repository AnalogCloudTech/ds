/// <reference types="mongoose" />
import { ReferralMarketingAdminsService } from '@/referral-marketing/magazines/services/referral-marketing-admins.service';
import { CreateMagazineAdminDto } from '@/referral-marketing/magazines/dto/create-magazine-admin.dto';
import { UploadCustomMagazineDto } from '@/referral-marketing/magazines/dto/upload-custom-magazine.dto';
import { CurrentMagazineMonthDate, TurnMonthDto } from '@/referral-marketing/magazines/dto/turn-month.dto';
import { UpdateMagazinesAdminDto } from '@/referral-marketing/magazines/dto/update-magazines-admin.dto';
import { UpdateMagazineAdminDto } from '@/referral-marketing/magazines/dto/update-magazine-admin.dto';
import { UpdateMagazineDto } from '../dto/update-magazine.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CustomerId } from '@/customers/customers/domain/types';
export declare class ReferralMarketingAdminsController {
    private readonly adminsService;
    constructor(adminsService: ReferralMarketingAdminsService);
    generateMagazine(dto: CreateMagazineAdminDto): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    uploadCustomCover(dto: UploadCustomMagazineDto): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    sendMagazinesToPrint(dto: UpdateMagazinesAdminDto): Promise<import("mongodb").UpdateResult>;
    sendMagazineToPrint(dto: UpdateMagazineAdminDto): Promise<import("mongodb").UpdateResult>;
    startMonthlyTurnOver(dto: TurnMonthDto): Promise<{
        message: string;
        jobs: number;
    }>;
    getMonthlyTurnOverStatus(): Promise<{
        count: number;
        active: number;
        failed: number;
    }>;
    schedulePermanentLinkTurnOver(dto: CurrentMagazineMonthDate): Promise<{
        message: string;
        jobs: number;
    }>;
    getSchedulePermanentLinkTurnOver(): Promise<{
        count: number;
        active: number;
        failed: number;
    }>;
    getGeneratedMagazine(year: string, month: string, customerId: CustomerId): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMagazine(year: string, month: string, customerId: CustomerId): Promise<import("mongoose").Document<unknown, any, import("../schemas/magazine.schema").Magazine> & import("../schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateMagazine(year: string, month: string, customerId: CustomerId, dto: UpdateMagazineDto): Promise<import("mongoose").Document<unknown, any, import("../schemas/magazine.schema").Magazine> & import("../schemas/magazine.schema").Magazine & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createTicket(id: string, customerId: CustomerId, admin: CustomerDocument): Promise<import("mongoose").Document<unknown, any, import("../schemas/generated-magazine.schema").GeneratedMagazine> & import("../schemas/generated-magazine.schema").GeneratedMagazine & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
