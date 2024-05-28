import { Controller, Post } from '@nestjs/common';
import { OnDemandEmailsService } from '@/campaigns/email-campaigns/on-demand-emails/on-demand-emails.service';
import { ApiKeyOnly } from '@/auth/auth.service';

@Controller('on-demand-emails-triggers')
export class OnDemandEmailsTriggersController {
  constructor(private readonly onDemandEmailsService: OnDemandEmailsService) {}

  @ApiKeyOnly()
  @Post('handle-on-demand-emails')
  async handle() {
    return this.onDemandEmailsService.handleCron();
  }

  @ApiKeyOnly()
  @Post('check-status')
  async checkStatus() {
    return this.onDemandEmailsService.checkStatus();
  }
}
