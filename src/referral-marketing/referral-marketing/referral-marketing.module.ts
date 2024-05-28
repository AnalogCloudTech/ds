import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ReferralMarketing,
  ReferralSchema,
} from './schemas/referral-marketing.schema';
import { ReferralMarketingService } from './referral-marketing.service';
import { ReferralMarketingController } from './referral-marketing.controller';
import { CommonHelper } from './helpers/common.helpers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ReferralMarketing.name, schema: ReferralSchema },
    ]),
  ],
  controllers: [ReferralMarketingController],
  providers: [ReferralMarketingService, CommonHelper],
})
export class ReferralMarketingModule {}
