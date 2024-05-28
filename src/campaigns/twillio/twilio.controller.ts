import { Body, Controller, Post } from '@nestjs/common';
import { ApiKeyOnly } from '@/auth/auth.service';
import { ValidationTransformPipe } from '@/internal/common/pipes/validation-transform.pipe';
import { SmsReplyPayloadDto } from '@/campaigns/twillio/dtos/sms-reply-payload.dto';
import { TwilioService } from '@/campaigns/twillio/twilio.service';

@Controller({
  version: '1',
  path: 'twilio',
})
export class TwilioController {
  constructor(private readonly twilioService: TwilioService) {}

  @ApiKeyOnly()
  @Post('webhook-handle-reply')
  async getReply(@Body(ValidationTransformPipe) reply: SmsReplyPayloadDto) {
    return this.twilioService.handleReply(reply);
  }
}
