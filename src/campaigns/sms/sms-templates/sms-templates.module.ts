import { Module } from '@nestjs/common';
import { SmsTemplatesService } from './sms-templates.service';
import { SmsTemplatesController } from './sms-templates.controller';
import { ConfigService } from '@nestjs/config';
import { Axios, AxiosRequestConfig } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';

@Module({
  controllers: [SmsTemplatesController],
  providers: [
    SmsTemplatesService,
    {
      provide: 'HTTP_CMS',
      useFactory: (configService: ConfigService): Axios => {
        const baseURL = configService.get<string>('cms.url');
        const key = configService.get<string>('cms.key');
        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig({
            authorization: `Bearer ${key}`,
          }),
          baseURL,
        };
        return new Axios(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: [SmsTemplatesService],
})
export class SmsTemplatesModule {}
