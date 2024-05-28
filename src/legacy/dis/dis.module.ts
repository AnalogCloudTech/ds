import { Logger, Module } from '@nestjs/common';
import { DisService } from './dis.service';
import { Axios, AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';

@Module({
  imports: [HubspotModule],
  providers: [
    Logger,
    DisService,
    {
      inject: [ConfigService],
      provide: 'HTTP_DIS',
      useFactory: (configService: ConfigService): Axios => {
        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig({
            authorization: `afy-api-key ${configService.get('dis.key')}`,
          }),
          baseURL: configService.get('dis.url'),
        };
        return new Axios(config);
      },
    },
  ],
  exports: [DisService, 'HTTP_DIS'],
})
export class DisModule {}
