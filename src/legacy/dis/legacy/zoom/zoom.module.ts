import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ZoomService } from './zoom.service';
import { ZoomController } from './controllers/zoom.controller';
import { ConfigService } from '@nestjs/config';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { HttpModule } from '@nestjs/axios';
import { Client as HubspotClient } from '@hubspot/api-client';
import { ZoomDsRepository } from './zoom.repository';
import { ZoomRecording, ZoomRecordingSchema } from './schemas/zoom.schema';
import { CustomersModule } from '@/customers/customers/customers.module';
import { S3Module } from '@/internal/libs/aws/s3/s3.module';
import { ZoomMember, ZoomMemberSchema } from './schemas/zoom-member.schema';
import {
  ZoomPhoneUser,
  ZoomPhoneUserSchema,
} from './schemas/zoom-phone-user.schema';
import { ZoomMemberRepository } from './zoom-member.repository';
import { Axios, AxiosRequestConfig } from 'axios';
import {
  ZOOM_API_KEY,
  ZOOM_SECRET_KEY,
  ZOOMAPI_PROVIDER_NAME,
} from './constants';
import { ZoomPhoneUserRepository } from './zoom-phone-user.repository';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';
import { ZoomTriggersController } from '@/legacy/dis/legacy/zoom/controllers/zoom-triggers.controller';

@Module({
  imports: [
    HubspotModule,
    MongooseModule.forFeature([
      { name: ZoomRecording.name, schema: ZoomRecordingSchema },
      { name: ZoomMember.name, schema: ZoomMemberSchema },
      { name: ZoomPhoneUser.name, schema: ZoomPhoneUserSchema },
    ]),
    CustomersModule,
    S3Module,
    HttpModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseURL = configService.get<string>('zoom.url');

        return {
          baseURL,
          headers: {
            Authorization: `Bearer ${configService.get('zoom.key')}`,
          },
        };
      },
    }),
  ],
  providers: [
    ZoomService,
    ZoomDsRepository,
    ZoomMemberRepository,
    ZoomPhoneUserRepository,
    Logger,
    {
      inject: [ConfigService],
      provide: HubspotClient,
      useFactory: (configService: ConfigService) => {
        const accessToken = configService.get<string>('hubspot.key');
        return new HubspotClient({
          accessToken,
        });
      },
    },
    {
      provide: 'INTEGRATION_SERVICES_URL',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('dis.url'),
      inject: [ConfigService],
    },
    {
      provide: ZOOMAPI_PROVIDER_NAME,
      useFactory: (configService: ConfigService): Axios => {
        const baseURL = configService.get<string>('zoom.zoomUrl');
        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig(),
          baseURL,
        };
        return new Axios(config);
      },
      inject: [ConfigService],
    },
    {
      inject: [ConfigService],
      provide: ZOOM_API_KEY,
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>('zoom.zoomApiKey');
      },
    },
    {
      inject: [ConfigService],
      provide: ZOOM_SECRET_KEY,
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>('zoom.zoomApiSecret');
      },
    },
    {
      provide: 'ZOOM_JWT_TOKEN',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('zoom.key'),
      inject: [ConfigService],
    },

    {
      provide: 'ZOOM_SERVER_O_URL',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('zoom.zoomServerOAuthUrl'),
      inject: [ConfigService],
    },
    {
      provide: 'ZOOM_BASIC_TOKEN',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('zoom.zoomBasicToken'),
      inject: [ConfigService],
    },

    {
      provide: 'ZOOM_SECRET_TOKEN',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('zoom.zoomSecretToken'),
      inject: [ConfigService],
    },

    {
      provide: 'APP_ENVIRONMENT',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('app.env'),
      inject: [ConfigService],
    },
    {
      provide: 'REVERSE_PROXY_URL',
      useFactory: (configService: ConfigService) =>
        configService.get<string>('zoom.proxy'),
      inject: [ConfigService],
    },
  ],
  controllers: [ZoomController, ZoomTriggersController],
  exports: [ZoomService],
})
export class ZoomModule {}
