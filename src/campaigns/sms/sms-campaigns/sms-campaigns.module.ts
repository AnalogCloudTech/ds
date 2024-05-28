import { Module } from '@nestjs/common';
import { SmsCampaignsService } from './sms-campaigns.service';
import { SmsCampaignsController } from './sms-campaigns.controller';
import { SmsCampaignRepository } from '@/campaigns/sms/sms-campaigns/repositories/sms-campaign.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SmsCampaign,
  SmsCampaignSchema,
} from '@/campaigns/sms/sms-campaigns/schemas/sms-campaign.schema';
import { LeadsModule } from '@/campaigns/email-campaigns/leads/leads.module';
import { SmsTemplatesModule } from '@/campaigns/sms/sms-templates/sms-templates.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SmsCampaign.name, schema: SmsCampaignSchema },
    ]),
    SmsTemplatesModule,
    LeadsModule,
  ],
  controllers: [SmsCampaignsController],
  providers: [SmsCampaignsService, SmsCampaignRepository],
  exports: [SmsCampaignsService],
})
export class SmsCampaignsModule {}
