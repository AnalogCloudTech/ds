import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Stripe } from './gateways/stripe';
import { ConfigService } from '@nestjs/config';
import { CmsModule } from '@/cms/cms/cms.module';
import { PaymentsChargifyModule } from '@/payments/payment_chargify/payments.module';

@Module({
  imports: [CmsModule, PaymentsChargifyModule],
  controllers: [PaymentsController],
  exports: [PaymentsService],
  providers: [
    PaymentsService,
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: Stripe,
    },
    {
      provide: 'STRIPE_SECRET_KEY',
      useFactory: (configService: ConfigService) =>
        configService.get('stripe.key'),
      inject: [ConfigService],
    },
  ],
})
export class PaymentsModule {}
