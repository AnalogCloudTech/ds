import { OnboardService } from '@/onboard/onboard.service';
import { Controller, Post } from '@nestjs/common';
import { ApiKeyOnly } from '@/auth/auth.service';

@Controller('onboard-triggers')
export class OnboardTriggersController {
  constructor(private readonly onboardService: OnboardService) {}

  @ApiKeyOnly()
  @Post('sync-customer-last-step-hubspot')
  async syncCustomerLastStepHubspot() {
    return this.onboardService.syncCustomerLastStepHubspot();
  }
}
