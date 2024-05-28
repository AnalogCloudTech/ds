import { Controller, Logger, Post } from '@nestjs/common';
import { WebhookService } from '@/payments/webhook/webhook.service';
import { ApiKeyOnly } from '@/auth/auth.service';

@Controller('webhook-triggers')
export class WebhookTriggersController {
  logger: Logger = new Logger(WebhookTriggersController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @ApiKeyOnly()
  @Post('handle-missing-association')
  async handleMissingAssociation() {
    this.logger.log('Handling missing association');

    // TODO: this is not a good solution but as the cronjob wasn't planned to be used like this I'm going to leave it like this for now
    this.webhookService.handleMissingAssociation().then(() => {
      this.logger.log('Finished handling missing association');
    });

    return { message: 'Handling missing association' };
  }
}
