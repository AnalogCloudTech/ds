import { Module, Logger } from '@nestjs/common';
import { MagazinesService } from './services/magazines.service';
import { MagazinesController } from './controllers/magazines.controller';
import {
  Magazine,
  MagazineSchema,
} from '@/referral-marketing/magazines/schemas/magazine.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsModule } from '@/cms/cms/cms.module';
import { MagazinesRepository } from '@/referral-marketing/magazines/repositories/magazines.repository';
import { GeneratedMagazinesController } from '@/referral-marketing/magazines/controllers/generated-magazines.controller';
import { GeneratedMagazinesRepository } from '@/referral-marketing/magazines/repositories/generated-magazines.repository';
import { GeneratedMagazinesService } from '@/referral-marketing/magazines/services/generated-magazines.service';
import {
  GeneratedMagazine,
  GeneratedMagazineSchema,
} from '@/referral-marketing/magazines/schemas/generated-magazine.schema';
import { SnsModule } from '@/internal/libs/aws/sns/sns.module';
import { LoggerWithContext } from '@/internal/utils/logger';
import { CONTEXT_REFERRAL_MARKETING_MAGAZINE } from '@/internal/common/contexts';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { ReferralMarketingAdminsController } from '@/referral-marketing/magazines/controllers/referral-marketing-admins.controller';
import { ReferralMarketingAdminsService } from '@/referral-marketing/magazines/services/referral-marketing-admins.service';
import { BullModule } from '@nestjs/bull';
import {
  MONTHLY_TURN_OVER_MAGAZINE_QUEUE,
  PERMANENT_LINKS_TURN_OVER,
} from '@/referral-marketing/magazines/constants';
import { AdminMonthlyMagazineProcessor } from '@/referral-marketing/magazines/processors/admin-monthly-magazine.processor';
import { FlippingBookModule } from '@/integrations/flippingbook/flippingbook.module';
import { AdminPermanentLinkQueueProcessor } from '@/referral-marketing/magazines/processors/admin-permanent-link-queue.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Magazine.name, schema: MagazineSchema },
      { name: GeneratedMagazine.name, schema: GeneratedMagazineSchema },
    ]),
    BullModule.registerQueueAsync({
      name: MONTHLY_TURN_OVER_MAGAZINE_QUEUE,
    }),
    BullModule.registerQueueAsync({
      name: PERMANENT_LINKS_TURN_OVER,
    }),
    CmsModule,
    SnsModule,
    HubspotModule,
    FlippingBookModule,
  ],
  controllers: [
    GeneratedMagazinesController,
    MagazinesController,
    ReferralMarketingAdminsController,
  ],
  providers: [
    Logger,
    MagazinesRepository,
    MagazinesService,
    GeneratedMagazinesRepository,
    GeneratedMagazinesService,
    ReferralMarketingAdminsService,
    AdminMonthlyMagazineProcessor,
    AdminPermanentLinkQueueProcessor,
    LoggerWithContext(CONTEXT_REFERRAL_MARKETING_MAGAZINE),
  ],
  exports: [MagazinesService, GeneratedMagazinesService],
})
export class MagazinesModule {}
