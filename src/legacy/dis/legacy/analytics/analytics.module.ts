import { Logger, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { ConfigService } from '@nestjs/config';
import { Client } from '@hubspot/api-client';
import { LeadsModule } from '@/campaigns/email-campaigns/leads/leads.module';
import { Axios, AxiosRequestConfig } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';

@Module({
  imports: [LeadsModule],
  controllers: [AnalyticsController],
  providers: [
    Logger,
    AnalyticsService,
    {
      inject: [ConfigService],
      provide: 'HTTP_ANALYTICS',
      useFactory: (configService: ConfigService): Axios => {
        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig(),
          auth: {
            username: configService.get<string>('elasticSearch.username'),
            password: configService.get<string>('elasticSearch.password'),
          },
          baseURL: configService.get<string>('elasticSearch.url'),
        };
        return new Axios(config);
      },
    },
    {
      inject: [ConfigService],
      provide: Client,
      useFactory: (configService: ConfigService) => {
        const accessToken = configService.get<string>('hubspot.key');
        return new Client({
          accessToken,
        });
      },
    },
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
