import { Logger, Module } from '@nestjs/common';
import { UpgradePlanController } from './upgrade-plan.controller';
import { UpgradePlanService } from './upgrade-plan.service';
import { PaymentsChargifyModule } from '@/payments/payment_chargify/payments.module';
import { ProductsModule } from '@/onboard/products/products.module';
import { PaymentsModule } from '@/legacy/dis/legacy/payments/payments.module';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';

  
@Module({
  imports: [
    PaymentsChargifyModule,
    ProductsModule,
    PaymentsModule,
    HubspotModule,
  ],
  providers: [UpgradePlanService, Logger],
  controllers: [UpgradePlanController],
  exports: [UpgradePlanService],
})
export class UpgradePlanModule {}
