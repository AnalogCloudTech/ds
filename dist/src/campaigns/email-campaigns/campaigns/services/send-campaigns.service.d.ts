import { Logger } from '@nestjs/common';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services/campaigns.service';
import { LeadDocument } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { CustomersService } from '@/customers/customers/customers.service';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { Model } from 'mongoose';
import { CampaignDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { Email } from '@/cms/cms/types/email';
import { MessageId } from 'aws-sdk/clients/ses';
import { CampaignHandler, CampaignHistoryType } from '@/campaigns/email-campaigns/campaigns/domain/types';
import { CampaignHistory, CampaignHistoryDocument } from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ContentsService } from '@/campaigns/email-campaigns/contents/contents.service';
import { EmailHistoryDocument } from '@/campaigns/email-campaigns/email-history/schemas/email-history.schema';
import { EmailHistoryService } from '@/campaigns/email-campaigns/email-history/email-history.service';
import { CampaignRepository } from '@/campaigns/email-campaigns/campaigns/repositories/campaign.repository';
import { DataObject } from '@/cms/cms/types/common';
import { Template } from '@/cms/cms/types/template';
import { AfyNotificationsService } from '@/integrations/afy-notifications/afy-notifications.service';
export declare class SendCampaignsService {
    private readonly campaignsService;
    private readonly customersService;
    private readonly sesService;
    private readonly leadsService;
    private readonly contentsService;
    private readonly emailHistoryService;
    private readonly campaignsRepository;
    private readonly campaignHistoryModel;
    private readonly eventEmitter;
    private readonly afyNotificationsService;
    private readonly logger;
    constructor(campaignsService: CampaignsService, customersService: CustomersService, sesService: SesService, leadsService: LeadsService, contentsService: ContentsService, emailHistoryService: EmailHistoryService, campaignsRepository: CampaignRepository, campaignHistoryModel: Model<CampaignHistoryDocument>, eventEmitter: EventEmitter2, afyNotificationsService: AfyNotificationsService, logger: Logger);
    sendCampaign(customerEmail: string, templateName: string, leads: LeadDocument[]): Promise<import("aws-sdk/clients/ses").SendBulkTemplatedEmailResponse>;
    setLeadsUsage(leads: Array<LeadDocument>): Promise<any[]>;
    sendAbsoluteCampaign(campaign: CampaignDocument): Promise<void>;
    sendRelativeCampaign(campaign: CampaignDocument): Promise<void>;
    sendAllCampaignsByHandler(campaigns: Array<CampaignDocument>, handler: CampaignHandler): Promise<void>;
    processCampaignForChunkedLeads(leads: Array<LeadDocument>, customer: CustomerDocument, template: DataObject<Template>): Promise<{
        leadsToUpdate: (import("mongoose").Document<unknown, any, import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead> & import("@/campaigns/email-campaigns/leads/schemas/lead.schema").Lead & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        emailMessageIds: any[];
    }>;
    createCampaignHistory(campaign: CampaignDocument, templateNames: Array<string>, messageIds: Array<MessageId>, type: CampaignHistoryType): Promise<import("mongoose").Document<unknown, any, CampaignHistory> & CampaignHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getCampaignLeads(campaign: CampaignDocument): Promise<LeadDocument[]>;
    createHistory(campaign: CampaignDocument, lead: LeadDocument): Promise<EmailHistoryDocument>;
    getCampaignsToBeSent(): Promise<CampaignDocument[] | null>;
    handleEvents(campaign: CampaignDocument, emails: Array<Email>, leads: Array<LeadDocument>): void;
    getCustomTemplateIfExists(email: Email, customer: CustomerDocument): {
        template: DataObject<Template>;
        isCustom: boolean;
    };
    private getHtmlFromLead;
}
