import { Module } from '@nestjs/common';
import { CampaingsService } from './campaings.service';
import { CampaingsController } from './controllers/campaings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaigns, CampaignsSchema } from './schemas/campaigns.schema';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { SEND_SM_CAMPAIGN_QUEUE_PROCESSOR } from './constants';
import {
  Attribute,
  AttributeSchema,
} from '../attributes/schemas/attributes.schemas';
import { CmsModule } from '@/cms/cms/cms.module';
import { CommonHelpers } from './helpers/common.helpers';
import { Axios, AxiosRequestConfig } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';

@Module({
  exports: [CampaingsService],
  imports: [
    MongooseModule.forFeature([
      { name: Campaigns.name, schema: CampaignsSchema },
      { name: Attribute.name, schema: AttributeSchema },
    ]),
    BullModule.registerQueueAsync({
      name: SEND_SM_CAMPAIGN_QUEUE_PROCESSOR,
    }),
    CmsModule,
  ],
  controllers: [CampaingsController],
  providers: [
    CampaingsService,
    CommonHelpers,
    {
      provide: 'HTTP_FACEBOOK',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Axios => {
        const baseURL = configService.get<string>('facebookToken.host');
        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig(),
          baseURL,
        };

        return new Axios(config);
      },
    },
  ],
})
export class CampaingsModule {}
