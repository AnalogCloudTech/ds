import { Module, Logger } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from '@/campaigns/social-media/templates/templates.service';
import { CmsModule } from '@/cms/cms/cms.module';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';

@Module({
  imports: [CmsModule, SesModule],
  controllers: [TemplatesController],
  providers: [TemplatesService, Logger],
  exports: [TemplatesService],
})
export class TemplatesModule {}
