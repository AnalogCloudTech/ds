import { SmsReplyPayloadDto } from '@/campaigns/twillio/dtos/sms-reply-payload.dto';
import { TwilioService } from '@/campaigns/twillio/twilio.service';
export declare class TwilioController {
    private readonly twilioService;
    constructor(twilioService: TwilioService);
    getReply(reply: SmsReplyPayloadDto): Promise<import("./domain/types").SMSReplyOutput>;
}
