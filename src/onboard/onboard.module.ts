import { Logger, Module } from '@nestjs/common';
import { OnboardService } from './onboard.service';
import { Connection } from 'mongoose';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Session, SessionSchema } from './schemas/session.schema';
import { Offer, OfferSchema } from './schemas/offer.schema';
import { OnboardController } from './controllers/onboard.controller';
import { CustomersService } from '@/customers/customers/customers.service';
import { DisModule } from '@/legacy/dis/dis.module';
import { ProductsModule } from '@/onboard/products/products.module';
import {
  WebhookIdempotency,
  WebhookIdempotencySchema,
} from './schemas/webhook-idempotency.schema';
import { CoachesModule } from '@/onboard/coaches/coaches.module';
import { BookOption, BookOptionSchema } from './schemas/book-option.schema';
import { GenerateBookModule } from '@/onboard/generate-book/generate-book.module';
import { GenerateBookService } from '@/onboard/generate-book/generate-book.service';
import { ConfigService } from '@nestjs/config';
import { HubspotModule } from '@/legacy/dis/legacy/hubspot/hubspot.module';
import { OnboardConsumer } from './onboard.consumer';
import { OnboardProcessor } from './onboard.processor';
import { BullModule } from '@nestjs/bull';
import { COACHING_REMINDER_EMAIL_NAME } from './constants';
import { LeadsModule } from '@/campaigns/email-campaigns/leads/leads.module';
import { SesModule } from '@/internal/libs/aws/ses/ses.module';
import { SesService } from '@/internal/libs/aws/ses/ses.service';
import { CmsModule } from '@/cms/cms/cms.module';
import { PaymentsModule } from '@/legacy/dis/legacy/payments/payments.module';
import { PaymentsChargifyModule } from '@/payments/payment_chargify/payments.module';
import { EmailRemindersModule } from './email-reminders/email-reminders.module';
import { ChargifyModule } from '@/payments/chargify/chargify.module';
import { Axios, AxiosRequestConfig } from 'axios';
import { Content } from '@/internal/config/app.config';
import { axiosDefaultsConfig } from '@/internal/utils/axiosTranformer/axios-defaults-config';
import { CalendarModule } from '@/legacy/dis/legacy/calendar/calendar.module';
import { CustomerEventsModule } from '@/customers/customer-events/customer-events.module';
import { SessionRepository } from '@/onboard/repositories/session.repository';
import { SessionService } from '@/onboard/services/session.service';
import { CustomerPropertiesModule } from '@/customers/customer-properties/customer-properties.module';
import AfyLoggerModule from '@/integrations/afy-logger/afy-logger.module';
import { DentistCoachesModule } from '@/onboard/dentist-coaches/dentist-coaches.module';
import { OffersService } from '@/onboard/services/offers.service';
import { OffersRepository } from '@/onboard/repositories/offers.repository';
import { S3Module } from '@/internal/libs/aws/s3/s3.module';
import { OnboardTriggersController } from '@/onboard/controllers/onboard-triggers.controller';
import { HUBSPOT_SYNC_ACTIONS_QUEUE } from '@/legacy/dis/legacy/hubspot/constants';

@Module({
  imports: [
    DisModule,
    CoachesModule,
    ProductsModule,
    LeadsModule,
    SesModule,
    GenerateBookModule,
    CmsModule,
    HubspotModule,
    PaymentsModule,
    PaymentsChargifyModule,
    EmailRemindersModule,
    CustomerEventsModule,
    BullModule.registerQueueAsync(
      {
        name: COACHING_REMINDER_EMAIL_NAME,
      },
      {
        name: HUBSPOT_SYNC_ACTIONS_QUEUE,
      },
    ),
    MongooseModule.forFeatureAsync([
      {
        name: Session.name,
        useFactory: (connection: Connection) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
          const AutoIncrement = AutoIncrementFactory(connection);

          const schema = SessionSchema;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          schema.plugin(AutoIncrement, {
            inc_field: 'order',
            start_seq: 1,
          });

          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forFeature([
      { name: Offer.name, schema: OfferSchema },
      { name: WebhookIdempotency.name, schema: WebhookIdempotencySchema },
      { name: BookOption.name, schema: BookOptionSchema },
    ]),
    ChargifyModule,
    CalendarModule,
    CustomerPropertiesModule,
    AfyLoggerModule,
    DentistCoachesModule,
    S3Module,
  ],
  providers: [
    SesService,
    OnboardService,
    CustomersService,
    GenerateBookService,
    Logger,
    SessionService,
    SessionRepository,
    OnboardConsumer,
    OnboardProcessor,
    OffersRepository,
    OffersService,
    {
      provide: 'CONTENT_CONFIG',
      useFactory: (configService: ConfigService) =>
        configService.get<Content>('content'),
      inject: [ConfigService],
    },
    {
      provide: 'HTTP_DIS',
      useFactory: (configService: ConfigService): Axios => {
        const baseURL = configService.get<string>('bookApi.url');
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
      provide: 'SCHEDULE_COACH_DURATION',
      useFactory: (configService: ConfigService): number => {
        return configService.get<number>(
          'onboardSettings.scheduleCoachDuration',
        );
      },
    },
  ],
  controllers: [OnboardController, OnboardTriggersController],
  exports: [OnboardService, SessionService, SessionRepository, OffersService],
})
export class OnboardModule {}
