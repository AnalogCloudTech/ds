import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Axios } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';
import { FlippingBookService } from '@/integrations/flippingbook/services/flippingbook.service';

@Module({
  imports: [],
  providers: [
    {
      provide: 'HTTP_FLIPPING_API',
      useFactory: (configService: ConfigService) => {
        const baseURL = configService.get<string>('flippingAPI.url');
        const key = configService.get<string>('flippingAPI.key');

        return new Axios({
          ...axiosDefaultsConfig({
            authorization: `Bearer ${key}`,
          }),
          baseURL,
        });
      },
      inject: [ConfigService],
    },
    FlippingBookService,
  ],
  exports: [FlippingBookService],
})
export class FlippingBookModule {}
