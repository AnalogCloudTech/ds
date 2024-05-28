import { Twilio } from 'twilio';
import { sendSMSParams, SMSReplyOutput } from '@/campaigns/twillio/domain/types';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { SmsTemplate } from '@/campaigns/sms/sms-templates/domain/types';
import { SmsReplyPayloadDto } from '@/campaigns/twillio/dtos/sms-reply-payload.dto';
import { CustomersService } from '@/customers/customers/customers.service';
import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
export declare class TwilioService {
    private readonly twilio;
    private readonly from;
    private readonly customersService;
    constructor(twilio: Twilio, from: string, customersService: CustomersService);
    sendSMS(params: sendSMSParams): Promise<MessageInstance>;
    handleReply(reply: SmsReplyPayloadDto): Promise<SMSReplyOutput>;
    private getOption;
    stopReminders(reply: SmsReplyPayloadDto): Promise<SMSReplyOutput>;
    buildSMSMessageForCustomer(populatedReminder: EmailReminderDocument, template: SmsTemplate): sendSMSParams;
}
