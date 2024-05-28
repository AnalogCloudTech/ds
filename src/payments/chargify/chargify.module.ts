import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChargifyController } from './chargify.controller';
import { ChargifyService } from '@/payments/chargify/chargify.service';
import { Axios, AxiosRequestConfig } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';

@Module({
  imports: [],
  controllers: [ChargifyController],
  providers: [
    ChargifyService,
    {
      provide: 'HTTP_CHARGIFY',
      useFactory: (configService: ConfigService): Axios => {
        if (configService.get<string>('env') == 'test') {
          return null;
        }

        const baseURL = configService.get<string>('chargify.sub_domain');
        const key = configService.get<string>('chargify.api_key');

        const buffer = Buffer.from(key);
        const base64EncodedAPIKey = buffer.toString('base64');

        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig({
            authorization: `Basic ${base64EncodedAPIKey}`,
          }),
          baseURL,
        };
        return new Axios(config);
      },
      inject: [ConfigService],
    },
  ],
  exports: [ChargifyService],
})
export class ChargifyModule {}
