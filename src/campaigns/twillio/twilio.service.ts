import { Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import {
  sendSMSParams,
  SMSReplyOutput,
} from '@/campaigns/twillio/domain/types';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { SmsTemplate } from '@/campaigns/sms/sms-templates/domain/types';
import {
  possibleOptions,
  TwilioNumberProvider,
  TwilioProviderName,
} from '@/campaigns/twillio/constants';
import { camelCase, isNull } from 'lodash';
import { SmsReplyPayloadDto } from '@/campaigns/twillio/dtos/sms-reply-payload.dto';
import { CustomersService } from '@/customers/customers/customers.service';
import { replaceTags } from '@/internal/utils/aws/ses/replaceTags';
import { EmailReminderDocument } from '@/onboard/email-reminders/schemas/email-reminder.schema';
import { CustomerDocument } from '@/customers/customers/schemas/customer.schema';
import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';

@Injectable()
export class TwilioService {
  constructor(
    @Inject(TwilioProviderName) private readonly twilio: Twilio,
    @Inject(TwilioNumberProvider) private readonly from: string,
    private readonly customersService: CustomersService,
  ) {}

  public async sendSMS(params: sendSMSParams): Promise<MessageInstance> {
    return this.twilio.messages.create(params);
  }

  public async handleReply(reply: SmsReplyPayloadDto): Promise<SMSReplyOutput> {
    const option = this.getOption(reply.Body);
    const isAValidOption =
      typeof this[option] === 'function' && possibleOptions.includes(option);

    if (!isAValidOption) {
      return <SMSReplyOutput>{
        reply,
        reason: 'invalid option',
        status: 'failed',
        option: 'invalidOption',
      };
    }

    return this[option](reply);
  }

  private getOption(message: string): string | null {
    const optionsRegex = /stop reminders/gi;
    const matches = message.match(optionsRegex);
    return isNull(matches) ? null : camelCase(matches[0]);
  }

  public async stopReminders(
    reply: SmsReplyPayloadDto,
  ): Promise<SMSReplyOutput> {
    const { From: fromNumber } = reply;

    const customer =
      await this.customersService.unsubscribeSMSRemindersByPhoneNumber(
        fromNumber,
      );

    return <SMSReplyOutput>{
      option: 'stopReminders',
      reply,
      status: customer ? 'success' : 'failed',
      reason: !customer ? 'customer not found' : '',
    };
  }

  public buildSMSMessageForCustomer(
    populatedReminder: EmailReminderDocument,
    template: SmsTemplate,
  ): sendSMSParams {
    const customer = <CustomerDocument>populatedReminder.customer;
    const coach = <CoachDocument>populatedReminder.coach;

    const body = replaceTags(template.content, {
      '{{CUSTOMER_NAME}}': customer.firstName,
      '{{COACH_NAME}}': coach.name,
      '{{ZOOM_LINK}}': populatedReminder.meetingLink,
      '{{MEETING_DATE_TIME}}': populatedReminder.meetingDateFormatted,
    });

    const phone = customer?.phone;

    const to = !isNull(phone?.match(/\+1/)) ? `+1${phone}` : phone;

    return {
      body,
      to,
      from: this.from,
    };
  }
}
