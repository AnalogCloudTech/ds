import { Module, ParseBoolPipe } from '@nestjs/common';
import { AboController } from '@/abo/controllers/abo.controller';
import { UpsellModule } from '@/onboard/upsell/upsell.module';
import { UploadsModule } from '@/uploads/uploads.module';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { S3Module } from '@/internal/libs/aws/s3/s3.module';
import { ZoomModule } from '@/legacy/dis/legacy/zoom/zoom.module';
import { PaymentsChargifyModule } from '@/payments/payment_chargify/payments.module';
import { OnboardModule } from '@/onboard/onboard.module';
import { MagazinesModule } from '@/referral-marketing/magazines/magazines.module';

@Module({
  imports: [
    HubspotModule,
    S3Module,
    UpsellModule,
    UploadsModule,
    ZoomModule,
    PaymentsChargifyModule,
    OnboardModule,
    MagazinesModule,
  ],
  controllers: [AboController],
  providers: [ParseBoolPipe],
})
export class AboModule {}
