import { Logger, Module } from '@nestjs/common';
import { PaymentChargifyController } from './payments.controller';
import { PaymentChargifyService } from '@/payments/payment_chargify/payments.service';
import { ChargifyModule } from '@/payments/chargify/chargify.module';
import { PaymentsWebsocketGateway } from '@/payments/payment_chargify/gateways/payments.gateway';
import { ProductsModule } from '@/onboard/products/products.module';
import { CmsModule } from '@/cms/cms/cms.module';
import { PaymentStatusRepository } from '@/payments/payment_chargify/repositories/payment-status.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentStatus,
  PaymentStatusSchema,
} from '@/payments/payment_chargify/schemas/payment-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentStatus.name, schema: PaymentStatusSchema },
    ]),
    ChargifyModule,
    ProductsModule,
    CmsModule,
  ],
  controllers: [PaymentChargifyController],
  providers: [
    PaymentChargifyService,
    PaymentsWebsocketGateway,
    Logger,
    PaymentStatusRepository,
  ],
  exports: [PaymentChargifyService],
})
export class PaymentsChargifyModule {}
