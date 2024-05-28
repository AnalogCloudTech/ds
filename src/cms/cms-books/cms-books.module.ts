import {
  HttpException,
  HttpStatus,
  Logger,
  Module,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CmsBooksService } from './cms-books.service';
import { CmsBooksController } from './cms-books.controller';
import { ConfigService } from '@nestjs/config';
import { Axios, AxiosRequestConfig } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';
import { CmsBooksRepository } from '@/cms/cms-books/cms-books.repository';

@Module({
  imports: [],
  controllers: [CmsBooksController],
  providers: [
    CmsBooksService,
    {
      provide: 'HTTP_BOOK_CMS',
      scope: Scope.REQUEST,
      useFactory: async (configService: ConfigService): Promise<Axios> => {
        try {
          const baseURL = configService.get<string>('oldCms.authUrl');
          const identifier = configService.get<string>('oldCms.user');
          const password = configService.get<string>('oldCms.password');
          const config: AxiosRequestConfig = {
            ...axiosDefaultsConfig(),
            baseURL,
          };
          const authAxios = new Axios(config);
          const { status, data } = await authAxios.post<{ jwt: string }>('', {
            identifier,
            password,
          });

          if (status === HttpStatus.OK) {
            const { jwt } = data;
            const baseURL = configService.get<string>('oldCms.url');
            const config: AxiosRequestConfig = {
              ...axiosDefaultsConfig({
                authorization: `Bearer ${jwt}`,
              }),
              baseURL,
            };
            return new Axios(config);
          }

          throw new UnauthorizedException('Book CMS Authentication failed');
        } catch (error) {
          if (error instanceof UnauthorizedException) {
            throw new HttpException(
              `correctly configure environment variables of Book CMS - ${error?.message}`,
              HttpStatus.UNAUTHORIZED,
            );
          }
          if (error instanceof Error) {
            throw new HttpException(
              `correctly configure environment variables of Book CMS - ${error?.message}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }
      },
      inject: [ConfigService],
    },
    {
      provide: CmsBooksRepository,
      inject: ['HTTP_BOOK_CMS'],
      useFactory: (httpBookCms: Axios, logger: Logger): CmsBooksRepository => {
        return new CmsBooksRepository(httpBookCms, logger);
      },
    },
  ],
})
export class CmsBooksModule {}
