import { forwardRef, Logger, Module } from '@nestjs/common';
import { SegmentsController } from './segments.controller';
import { CmsModule } from '@/cms/cms/cms.module';
import { SegmentsService } from '@/campaigns/email-campaigns/segments/segments.service';
import { LeadsModule } from '@/campaigns/email-campaigns/leads/leads.module';

@Module({
  imports: [CmsModule, forwardRef(() => LeadsModule)],
  controllers: [SegmentsController],
  providers: [SegmentsService, Logger],
  exports: [SegmentsService],
})
export class SegmentsModule {}
