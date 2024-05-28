import { forwardRef, Module } from '@nestjs/common';
import { ContentsController } from './contents.controller';
import { CmsModule } from '@/cms/cms/cms.module';
import { ContentsService } from '@/campaigns/email-campaigns/contents/contents.service';
import { CampaignsModule } from '@/campaigns/email-campaigns/campaigns/campaigns.module';

@Module({
  imports: [CmsModule, forwardRef(() => CampaignsModule)],
  controllers: [ContentsController],
  providers: [ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}
