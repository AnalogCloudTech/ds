import { Logger, Module } from '@nestjs/common';
import { TwUpsellRepository } from '@/onboard/upsell/upsell.repository';
import { UpsellService } from '@/onboard/upsell/upsell.service';
import { UpsellReportQueueProcessor } from '@/onboard/upsell/processors/upsell-report-queue.processor';
import { UpsellController } from '@/onboard/upsell/controllers/upsell.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TripWireUpsell,
  TripWireUpsellSchema,
} from '@/onboard/upsell/schemas/tw-upsell.schema';
import { BullModule } from '@nestjs/bull';
import { UPSELL_REPORT_QUEUE } from '@/onboard/upsell/constant';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { S3Module } from '@/internal/libs/aws/s3/s3.module';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';
import { OnboardModule } from '@/onboard/onboard.module';

@Module({
  imports: [
    OnboardModule,
    BullModule.registerQueueAsync({
      name: UPSELL_REPORT_QUEUE,
    }),
    MongooseModule.forFeature([
      { name: TripWireUpsell.name, schema: TripWireUpsellSchema },
    ]),
    HubspotModule,
    S3Module,
    SesModule,
  ],
  controllers: [UpsellController],
  providers: [
    TwUpsellRepository,
    UpsellService,
    UpsellReportQueueProcessor,
    Logger,
  ],
  exports: [UpsellService],
})
export class UpsellModule {}
