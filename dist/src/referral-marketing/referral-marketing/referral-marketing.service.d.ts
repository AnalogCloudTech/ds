import { Model } from 'mongoose';
import { CreateReferralMarketingDto } from './dto/create-referral-marketing.dto';
import { UpdateReferralMarketingDto } from './dto/update-referral-marketing.dto';
import { ReferralMarketing, ReferralDocument } from './schemas/referral-marketing.schema';
import { CommonHelper } from './helpers/common.helpers';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
export declare class ReferralMarketingService {
    private readonly referralModel;
    private readonly commonHelper;
    constructor(referralModel: Model<ReferralDocument>, commonHelper: CommonHelper);
    create(createReferralMarketingDto: CreateReferralMarketingDto): Promise<ReferralMarketing & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    findAll(page: number, perPage: number, status: string, sorting: string): Promise<PaginatorSchematicsInterface>;
    findOne(id: string): Promise<ReferralMarketing & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    update(id: string, updateReferralMarketingDto: UpdateReferralMarketingDto): Promise<ReferralMarketing & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
    remove(id: string): Promise<ReferralMarketing & import("mongoose").Document<any, any, any> & {
        _id: any;
    }>;
}
