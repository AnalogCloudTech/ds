import { forwardRef, Logger, Module } from '@nestjs/common';
import { CampaignsService } from './services/campaigns.service';
import { CampaignsController } from './controllers/campaigns.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './schemas/campaign.schema';
import { ExistsInCmsRule } from '@/cms/cms/validation-rules/exists-in-cms';
import { CampaignListeners } from '@/campaigns/email-campaigns/campaigns/listeners/campaign.listeners';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';
import { LeadsModule } from '@/campaigns/email-campaigns/leads/leads.module';
import { ContentsModule } from '@/campaigns/email-campaigns/contents/contents.module';
import { CmsModule } from '@/cms/cms/cms.module';
import { SegmentsModule } from '@/campaigns/email-campaigns/segments/segments.module';
import { EmailHistoryModule } from '@/campaigns/email-campaigns/email-history/email-history.module';
import {
  CampaignHistory,
  CampaignHistorySchema,
} from '@/campaigns/email-campaigns/campaigns/schemas/campaign-history.schema';
import { SendCampaignsService } from '@/campaigns/email-campaigns/campaigns/services/send-campaigns.service';
import { CampaignRepository } from '@/campaigns/email-campaigns/campaigns/repositories/campaign.repository';
import { TemplatesModule } from '@/campaigns/email-campaigns/templates/templates.module';
import { AnalyticsModule } from '@/legacy/dis/legacy/analytics/analytics.module';
import { AfyNotificationsModule } from '@/integrations/afy-notifications/afy-notifications.module';
import { BullModule } from '@nestjs/bull';
import { CSV_UPLOADER_QUEUE } from '@/campaigns/email-campaigns/constants';
import { CsvUploaderQueueProcessor } from '@/campaigns/email-campaigns/processors/csv-uploader-queue.processor';
import { S3Module } from '@/internal/libs/aws/s3/s3.module';
import { CampaignsTriggersController } from '@/campaigns/email-campaigns/campaigns/controllers/campaigns-triggers.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: CampaignHistory.name, schema: CampaignHistorySchema },
    ]),
    BullModule.registerQueueAsync({
      name: CSV_UPLOADER_QUEUE,
    }),
    ContentsModule,
    SesModule,
    LeadsModule,
    CmsModule,
    SegmentsModule,
    forwardRef(() => EmailHistoryModule),
    forwardRef(() => TemplatesModule),
    AnalyticsModule,
    AfyNotificationsModule,
    S3Module,
  ],
  controllers: [CampaignsController, CampaignsTriggersController],
  providers: [
    Logger,
    CampaignsService,
    SendCampaignsService,
    ExistsInCmsRule,
    CampaignListeners,
    CampaignRepository,
    CsvUploaderQueueProcessor,
  ],
  exports: [CampaignsService, SendCampaignsService],
})
export class CampaignsModule {}
