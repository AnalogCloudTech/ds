import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacebookModule } from './facebook/facebook.module';
import { TemplatesModule } from './templates/templates.module';
import { CampaingsModule } from './campaings/campaings.module';
import { AttributesModule } from './attributes/attributes.module';
import { ContentsModule } from './contents/contents.module';

@Module({
  imports: [
    FacebookModule,
    HttpModule,
    TemplatesModule,
    CampaingsModule,
    AttributesModule,
    ContentsModule,
  ],
})
export class SocialMediaModule {}
