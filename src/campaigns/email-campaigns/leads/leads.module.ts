import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { CmsModule } from '@/cms/cms/cms.module';
import { SegmentsModule } from '@/campaigns/email-campaigns/segments/segments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    CmsModule,
    SegmentsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [MongooseModule, LeadsService],
})
export class LeadsModule {}
