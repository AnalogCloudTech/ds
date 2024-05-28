import { Logger, Module } from '@nestjs/common';
import { PaymentEventsController } from '@/integrations/afy-payments/controllers/payment-events.controller';
import { PaymentsChargifyModule } from '@/payments/payment_chargify/payments.module';
import { AfyPaymentsServices } from '@/integrations/afy-payments/afy-payments.services';
import { ProductsModule } from '@/onboard/products/products.module';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { BullModule } from '@nestjs/bull';
import { HUBSPOT_SYNC_ACTIONS_QUEUE } from '@/legacy/dis/legacy/hubspot/constants';
import { OnboardModule } from '@/onboard/onboard.module';
import { CustomerEventsModule } from '@/customers/customer-events/customer-events.module';
import { CustomerPropertiesModule } from '@/customers/customer-properties/customer-properties.module';
import { WebhookModule } from '@/payments/webhook/webhook.module';
import { ForceRefundSubscriptionInterceptor } from '@/internal/inteceptors/force-refund-subscription.interceptor';

@Module({
  imports: [
    PaymentsChargifyModule,
    ProductsModule,
    HubspotModule,
    OnboardModule,
    CustomerEventsModule,
    CustomerPropertiesModule,
    WebhookModule,
    BullModule.registerQueueAsync({
      name: HUBSPOT_SYNC_ACTIONS_QUEUE,
    }),
  ],
  controllers: [PaymentEventsController],
  providers: [AfyPaymentsServices, Logger, ForceRefundSubscriptionInterceptor],
})
export class AfyPaymentsModule {}
