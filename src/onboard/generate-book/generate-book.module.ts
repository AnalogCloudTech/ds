import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Axios, AxiosRequestConfig } from 'axios';
import { GenerateBookService } from './generate-book.service';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';

@Module({
  imports: [],
  providers: [
    GenerateBookService,
    {
      inject: [ConfigService],
      provide: 'HTTP_GENERATE_BOOK',
      useFactory: (configService: ConfigService): Axios => {
        const baseURL = configService.get<string>('bookApi.url');
        const apiKey = configService.get<string>('bookApi.key');
        const params = {
          key: apiKey,
        };
        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig(),
          baseURL,
          params,
        };
        return new Axios(config);
      },
    },
  ],
  exports: [GenerateBookService, 'HTTP_GENERATE_BOOK'],
})
export class GenerateBookModule {}
