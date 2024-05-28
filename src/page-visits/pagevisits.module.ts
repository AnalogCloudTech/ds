import { Module } from '@nestjs/common';
import { PagevisitsService } from './pagevisits.service';
import { PagevisitsController } from './pagevisits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsModule } from '@/cms/cms/cms.module';
import { SegmentsModule } from '@/campaigns/email-campaigns/segments/segments.module';
import { Pagevisits, PagevisitsSchema } from './schemas/pagevisits.schema';
import { PagevisitsRepository } from './repository/pagevisits.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pagevisits.name, schema: PagevisitsSchema },
    ]),
    CmsModule,
    SegmentsModule,
  ],
  controllers: [PagevisitsController],
  providers: [PagevisitsRepository, PagevisitsService],
  exports: [MongooseModule, PagevisitsService, PagevisitsRepository],
})
export class PagevisitsModule {}
