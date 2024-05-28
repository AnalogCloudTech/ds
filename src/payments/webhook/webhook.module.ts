import { Logger, Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './controllers/webhook.controller';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { PaymentsChargifyModule } from '@/payments/payment_chargify/payments.module';
import { ProductsModule } from '@/onboard/products/products.module';
import { OnboardModule } from '@/onboard/onboard.module';
import { CmsModule } from '@/cms/cms/cms.module';
import { PaymentsModule } from '@/legacy/dis/legacy/payments/payments.module';
import { CustomerEventsModule } from '@/customers/customer-events/customer-events.module';
import { CustomerPropertiesModule } from '@/customers/customer-properties/customer-properties.module';
import { AfyNotificationsModule } from '@/integrations/afy-notifications/afy-notifications.module';
import AfyLoggerModule from '@/integrations/afy-logger/afy-logger.module';
import { ForceRefundSubscriptionInterceptor } from '@/internal/inteceptors/force-refund-subscription.interceptor';
import { WebhookTriggersController } from '@/payments/webhook/controllers/webhook-triggers.controller';

@Module({
  imports: [
    HubspotModule,
    PaymentsChargifyModule,
    ProductsModule,
    OnboardModule,
    CmsModule,
    CustomerPropertiesModule,
    PaymentsModule,
    CustomerEventsModule,
    AfyNotificationsModule,
    AfyLoggerModule,
  ],
  controllers: [WebhookController, WebhookTriggersController],
  providers: [WebhookService, Logger, ForceRefundSubscriptionInterceptor],
  exports: [WebhookService],
})
export class WebhookModule {}
