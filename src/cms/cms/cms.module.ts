import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CmsController } from './cms.controller';
import { CmsService } from '@/cms/cms/cms.service';
import { Axios, AxiosRequestConfig } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';

@Module({
  imports: [],
  controllers: [CmsController],
  providers: [
    CmsService,
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
  exports: [CmsService],
})
export class CmsModule {}
