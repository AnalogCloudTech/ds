import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HubspotService } from './hubspot.service';
import { HubspotController } from './hubspot.controller';
import { Client as HubspotClient } from '@hubspot/api-client';
import { CustomerEventsModule } from '@/customers/customer-events/customer-events.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  HubspotSyncActions,
  HubspotSyncActionsSchema,
} from '@/legacy/dis/legacy/hubspot/schemas/hubspot-sync-actions.schema';
import { HubspotSyncActionsRepository } from '@/legacy/dis/legacy/hubspot/repository/hubspot-sync-actions.repository';
import { HubspotSyncActionsServices } from '@/legacy/dis/legacy/hubspot/hubspot-sync-actions.services';
import { BullModule } from '@nestjs/bull';
import {
  HUBSPOT_QUOTE_LINK_SENDER_QUEUE,
  HUBSPOT_SYNC_ACTIONS_QUEUE,
} from '@/legacy/dis/legacy/hubspot/constants';
import { HubspotSyncActionsProcessor } from '@/legacy/dis/legacy/hubspot/processors/hubspot-sync-actions.processor';
import { Axios, AxiosRequestConfig } from 'axios';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';
import { HubspotQuoteLinkSenderProcessor } from '@/legacy/dis/legacy/hubspot/processors/hubspot-quote-link-sender.processor';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';

@Module({
  controllers: [HubspotController],
  imports: [
    CustomerEventsModule,
    MongooseModule.forFeature([
      { name: HubspotSyncActions.name, schema: HubspotSyncActionsSchema },
    ]),
    HttpModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const baseURL = configService.get<string>('hubspot.url');

        return {
          baseURL,
        };
      },
    }),
    BullModule.registerQueueAsync(
      {
        name: HUBSPOT_SYNC_ACTIONS_QUEUE,
      },
      {
        name: HUBSPOT_QUOTE_LINK_SENDER_QUEUE,
      },
    ),
    SesModule,
  ],
  providers: [
    {
      inject: [ConfigService],
      provide: HubspotClient,
      useFactory: (configService: ConfigService) => {
        const accessToken = configService.get<string>('hubspot.key');
        const numberOfApiCallRetries =
          configService.get<number>('hubspot.retries');
        return new HubspotClient({
          accessToken,
          numberOfApiCallRetries,
        });
      },
    },
    {
      provide: 'HTTP_HS_FORMS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Axios => {
        const baseURL = configService.get<string>('hubspot.formsBaseUrl');
        const config: AxiosRequestConfig = {
          ...axiosDefaultsConfig(),
          baseURL,
        };
        return new Axios(config);
      },
    },
    {
      inject: [ConfigService],
      provide: 'APP_ENVIRONMENT',
      useFactory: (configService: ConfigService) =>
        configService.get<object>('app.env'),
    },
    HubspotService,
    HubspotSyncActionsRepository,
    HubspotSyncActionsServices,
    HubspotSyncActionsProcessor,
    HubspotQuoteLinkSenderProcessor,
    Logger,
  ],
  exports: [
    HubspotService,
    HubspotSyncActionsServices,
    HubspotSyncActionsProcessor,
    HubspotQuoteLinkSenderProcessor,
  ],
})
export class HubspotModule {}
