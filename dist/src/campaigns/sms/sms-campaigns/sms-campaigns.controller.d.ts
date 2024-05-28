import { SmsCampaignsService } from './sms-campaigns.service';
import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery } from 'mongoose';
import { SmsCampaignDocument } from '@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema';
import { Paginator } from '@/internal/utils/paginator';
import { SchemaId } from '@/internal/types/helpers';
export declare class SmsCampaignsController {
    private readonly smsCampaignsService;
    constructor(smsCampaignsService: SmsCampaignsService);
    create(customer: CustomerDocument, createSmsCampaignDto: CreateSmsCampaignDto): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign> & import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAll(customer: CustomerDocument, paginator: Paginator, query?: FilterQuery<SmsCampaignDocument>): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign> & import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findOne(id: SchemaId): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign> & import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(id: SchemaId, updateSmsCampaignDto: UpdateSmsCampaignDto): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign> & import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    remove(id: SchemaId): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign> & import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
