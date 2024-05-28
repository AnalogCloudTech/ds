import { Module, Logger } from '@nestjs/common';
import { ContentsController } from './contents.controller';
import { ContentsService } from '@/campaigns/social-media/contents/contents.service';
import { CmsModule } from '@/cms/cms/cms.module';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';

@Module({
  imports: [CmsModule, SesModule],
  controllers: [ContentsController],
  providers: [ContentsService, Logger],
  exports: [ContentsService],
})
export class ContentsModule {}
