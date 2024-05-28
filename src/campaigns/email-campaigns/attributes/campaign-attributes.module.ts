import { Module } from '@nestjs/common';
import { CampaignAttributesService } from './campaign-attributes.service';
import { CampaignAttributesController } from './campaign-attributes.controller';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';

@Module({
  imports: [SesModule],
  controllers: [CampaignAttributesController],
  providers: [CampaignAttributesService],
})
export class CampaignAttributesModule {}
