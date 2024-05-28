import { Logger, Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from '@/campaigns/email-campaigns/templates/templates.service';
import { CmsModule } from '@/cms/cms/cms.module';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';
import { CampaignsModule } from '@/campaigns/email-campaigns/campaigns/campaigns.module';
import { CustomerTemplatesModule } from '@/campaigns/email-campaigns/customer-templates/customer-templates.module';

@Module({
  imports: [CmsModule, SesModule, CampaignsModule, CustomerTemplatesModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, Logger],
  exports: [TemplatesService],
})
export class TemplatesModule {}
