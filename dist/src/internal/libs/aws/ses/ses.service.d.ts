import { Logger } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { Lead } from '@/campaigns/email-campaigns/leads/schemas/lead.schema';
import { ConfigService } from '@nestjs/config';
import { IamService } from '@/internal/libs/aws/iam/iam.service';
import { CreateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/create-custom-verification-email.dto';
import { UpdateCustomVerificationEmailDto } from '@/internal/libs/aws/ses/dto/update-custom-verification-email.dto';
import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { EmailReminder } from '@/onboard/dto/email-reminder.dto';
export declare class SesService {
    protected readonly ses: SES;
    private readonly configService;
    private readonly iamService;
    private readonly logger;
    constructor(ses: SES, configService: ConfigService, iamService: IamService, logger: Logger);
    sendSingleEmail(params: SES.SendEmailRequest): Promise<import("aws-sdk/lib/request").PromiseResult<SES.SendEmailResponse, import("aws-sdk").AWSError>>;
    buildSingleEmailParams(emailReminder: EmailReminder): Promise<SES.SendEmailRequest>;
    buildEmailReminderParams(emailReminder: EmailReminderDocument): Promise<SES.SendEmailRequest>;
    getTemplateData(templateName: string): Promise<SES.GetTemplateResponse>;
    listVerifiedEmailAddresses(): Promise<import("aws-sdk/lib/request").PromiseResult<SES.ListVerifiedEmailAddressesResponse, import("aws-sdk").AWSError>>;
    validateEmail(email: string): Promise<boolean>;
    emailIsVerified(email: string): Promise<boolean>;
    buildParamsFromLeads(source: any, templateName: any, leads: Lead[], attributes?: object): SES.SendBulkTemplatedEmailRequest;
    sendBulkTemplatedEmail(params: SES.SendBulkTemplatedEmailRequest): Promise<SES.SendBulkTemplatedEmailResponse>;
    setPolicy(email: string): Promise<import("aws-sdk/lib/request").PromiseResult<SES.PutIdentityPolicyResponse, import("aws-sdk").AWSError>>;
    sendVerificationEmail(email: string): Promise<void>;
    createTemplate(name: string, subject: string, html: string): Promise<SES.CreateTemplateResponse>;
    updateTemplate(name: string, subject: string, html: string): Promise<SES.UpdateTemplateResponse>;
    templateDetails(template: string): Promise<SES.GetTemplateResponse>;
    deleteTemplate(name: string): Promise<import("aws-sdk/lib/request").PromiseResult<SES.DeleteTemplateResponse, import("aws-sdk").AWSError>>;
    createDefaultCustomVerificationEmailTemplate(dto: CreateCustomVerificationEmailDto): Promise<{
        $response: import("aws-sdk").Response<{}, import("aws-sdk").AWSError>;
    }>;
    getCustomVerificationEmailTemplate(name: any): Promise<SES.Types.CustomVerificationEmailTemplate>;
    updateDefaultCustomVerificationEmailTemplate(name: string, dto: UpdateCustomVerificationEmailDto): Promise<{
        $response: import("aws-sdk").Response<{}, import("aws-sdk").AWSError>;
    }>;
    generateRouteForUnsubscribe(leadID: string): string;
    private buildResourceIdentity;
    private buildStatementSid;
}
