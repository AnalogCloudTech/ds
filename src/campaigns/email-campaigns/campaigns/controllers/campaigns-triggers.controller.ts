import { ApiKeyOnly } from '@/auth/auth.service';
import { Controller, Logger, Post } from '@nestjs/common';
import { CampaignsService } from '@/campaigns/email-campaigns/campaigns/services';

@Controller('campaigns-triggers')
export class CampaignsTriggersController {
  logger = new Logger(CampaignsTriggersController.name);

  constructor(private readonly campaignsService: CampaignsService) {}

  @ApiKeyOnly()
  @Post('handle-campaigns')
  handleCampaignsCron() {
    this.logger.log('Starting handleCampaignsCron');
    this.campaignsService.handleCampaigns().then(() => {
      this.logger.log('Finishing handleCampaignsCron');
    });
    return { message: 'Handling handleCampaignsCron' };
  }
}
