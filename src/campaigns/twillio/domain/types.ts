import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import { SmsReplyPayloadDto } from '@/campaigns/twillio/dtos/sms-reply-payload.dto';

export type sendSMSParams = Pick<
  MessageListInstanceCreateOptions,
  'body' | 'from' | 'to'
>;

export enum SMSStatus {
  RECEIVED = 'received',
  SENT = 'sent',
}

export type SMSReplyOutput = {
  option: string;
  status: string;
  reason: string;
  reply: SmsReplyPayloadDto;
};
