import { FilterQuery } from 'mongoose';
import { EmailHistory, EmailHistoryDocument } from '@/campaigns/email-campaigns/email-history/schemas/email-history.schema';
import { CreateFromEmailCampaignsDto } from '@/campaigns/email-campaigns/email-history/dto/create-from-email-campaigns.dto';
import { CampaignsService } from '../campaigns/services';
import { LeadsService } from '../leads/leads.service';
import { OnDemandEmailsService } from '../on-demand-emails/on-demand-emails.service';
import { LeadHistoryStatus, RelationTypes } from './schemas/types';
import { SNSMessage } from './utils/parse-sns-response';
import { PaginatorSchematicsInterface } from '@/internal/utils/paginator';
import { CampaignsHistoryIds, CampaignsIds } from './domain/types';
import { EmailHistoryRepository } from '@/campaigns/email-campaigns/email-history/email-history.repository';
export declare class EmailHistoryService {
    private readonly emailHistoryRepository;
    private readonly campaignsService;
    private readonly onDemandEmailsService;
    private readonly leadsService;
    constructor(emailHistoryRepository: EmailHistoryRepository, campaignsService: CampaignsService, onDemandEmailsService: OnDemandEmailsService, leadsService: LeadsService);
    listEmailHistory(user: any, page: number, perPage: number, status: LeadHistoryStatus[], type: RelationTypes[]): Promise<PaginatorSchematicsInterface<EmailHistoryDocument>>;
    getEmailHistory(user: any, id: string): Promise<Array<EmailHistoryDocument>>;
    getEmailHistoryByLead(user: any, leadId: string, page: number, perPage: number, status: LeadHistoryStatus[], type: RelationTypes[]): Promise<PaginatorSchematicsInterface<EmailHistoryDocument>>;
    createFromSNS(snsMessage: SNSMessage): Promise<Array<EmailHistoryDocument>>;
    addHistoryFromOnDemandEmail(dto: CreateFromEmailCampaignsDto): Promise<EmailHistoryDocument>;
    getEmailHistoryCount(campaignsIds: CampaignsIds[]): Promise<[number, number]>;
    getEmailHistoryCountBycampaignHisId(campaignsHistoryids: CampaignsHistoryIds[]): Promise<[number, number]>;
    getEmailHistoryCountBycampaignHistoryId(campaignsIds: CampaignsHistoryIds, email: string): Promise<[number, number, number]>;
    countEmailHistory(filter: FilterQuery<EmailHistory>): Promise<number>;
}
