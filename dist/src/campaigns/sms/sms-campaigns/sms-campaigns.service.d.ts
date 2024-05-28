import { CreateSmsCampaignDto } from './dto/create-sms-campaign.dto';
import { UpdateSmsCampaignDto } from './dto/update-sms-campaign.dto';
import { SmsCampaignRepository } from '@/campaigns/sms/sms-campaigns/repositories/sms-campaign.repository';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { FilterQuery } from 'mongoose';
import { SmsCampaignDocument } from '@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema';
import { Paginator } from '@/internal/utils/paginator';
import { SchemaId } from '@/internal/types/helpers';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
export declare class SmsCampaignsService {
    private readonly repository;
    private readonly leadsService;
    constructor(repository: SmsCampaignRepository, leadsService: LeadsService);
    store(customer: CustomerDocument, createSmsCampaignDto: CreateSmsCampaignDto): Promise<import("mongoose").Document<unknown, any, import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign> & import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findAllPaginated(customer: CustomerDocument, paginator: Paginator, query?: FilterQuery<SmsCampaignDocument>): Promise<import("@/internal/utils/paginator").PaginatorSchematicsInterface<import("mongoose").Document<unknown, any, import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign> & import("@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema").SmsCampaign & {
        _id: import("mongoose").Types.ObjectId;
    }>>;
    findOne(id: SchemaId): Promise<SmsCampaignDocument>;
    update(id: SchemaId, updateSmsCampaignDto: UpdateSmsCampaignDto): Promise<SmsCampaignDocument>;
    remove(id: SchemaId): Promise<SmsCampaignDocument>;
    campaignsToBeSent(): Promise<Array<SmsCampaignDocument>>;
    getLeads(smsCampaign: SmsCampaignDocument, customer: CustomerDocument): Promise<Array<LeadDocument>>;
    setDone(smsCampaign: SmsCampaignDocument): Promise<SmsCampaignDocument>;
}
