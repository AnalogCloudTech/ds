import { Logger } from '@nestjs/common';
import { EmailRemindersService } from '@/onboard/email-reminders/email-reminders.service';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { TwilioService } from '@/campaigns/twillio/twilio.service';
import { CustomersService } from '@/customers/customers/customers.service';
import { SmsTemplatesService } from '@/campaigns/sms/sms-templates/sms-templates.service';
export declare class EmailRemindersScheduler {
    private readonly service;
    private readonly sesService;
    private readonly twilioService;
    private readonly customersService;
    private readonly smsTemplateService;
    private readonly logger;
    constructor(service: EmailRemindersService, sesService: SesService, twilioService: TwilioService, customersService: CustomersService, smsTemplateService: SmsTemplatesService, logger: Logger);
    handleCron(): Promise<void>;
}
