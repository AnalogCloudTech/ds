import { Logger } from '@nestjs/common';
import { OnDemandEmailsService } from '@/campaigns/email-campaigns/on-demand-emails/on-demand-emails.service';
import { AfyNotificationsService, EmailMessage } from '@/integrations/afy-notifications/afy-notifications.service';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { OnDemandEmailDocument } from '@/campaigns/email-campaigns/on-demand-emails/schemas/on-demand-email.schema';
import { LeadsService } from '@/campaigns/email-campaigns/leads/leads.service';
import { Model } from 'mongoose';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
export declare class OnDemandEmailsScheduler {
    private readonly onDemandEmailModel;
    private readonly service;
    private readonly templatesService;
    private readonly leadsService;
    private readonly sesService;
    private readonly afyNotificationsService;
    private readonly logger;
    constructor(onDemandEmailModel: Model<OnDemandEmailDocument>, service: OnDemandEmailsService, templatesService: TemplatesService, leadsService: LeadsService, sesService: SesService, afyNotificationsService: AfyNotificationsService, logger: Logger);
    generateOnDemandEmails(onDemandEmails: OnDemandEmailDocument[]): Promise<EmailMessage[]>;
    handleCron(): Promise<void>;
    checkStatus(): Promise<void>;
    private getHtmlFromLead;
    private getOnDemandEmailLeads;
    private updateStatus;
}
