import { Module } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { HealthCheckController } from './health-check.controller';
import { CmsModule } from '@/cms/cms/cms.module';
import { GenerateBookModule } from '@/onboard/generate-book/generate-book.module';
import { AnalyticsModule } from '@/legacy/dis/legacy/analytics/analytics.module';

@Module({
  imports: [CmsModule, GenerateBookModule, AnalyticsModule],
  controllers: [HealthCheckController],
  providers: [HealthCheckService],
})
export class HealthCheckModule {}
