import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsoleModule } from 'nestjs-console';
import { MongooseModule } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Connection, Schema } from 'mongoose';
import { get } from 'lodash';
import configuration from './internal/config/app.config';
import { OnboardModule } from './onboard/onboard.module';
import { UpgradePlanModule } from './upgrade-plan/upgrade-plan.module';
import { TrackingPixelModule } from './onboard/tracking-pixel/tracking-pixel.module';
import { CustomersModule } from './customers/customers/customers.module';
import { ApiKeysModule } from './auth/api-keys/api-keys.module';
import { AuthModule } from './auth/auth.module';
import { ApiKeysGuard } from './internal/common/guards/api-keys.guard';
import { JwtGuard } from './internal/common/guards/jwt.guard';
import { AuthService } from './auth/auth.service';
import { GenerateBookModule } from './onboard/generate-book/generate-book.module';
import { ProductsModule } from './onboard/products/products.module';
import { CoachesModule } from './onboard/coaches/coaches.module';
import { DisModule } from './legacy/dis/dis.module';
import { LeadsModule } from './campaigns/email-campaigns/leads/leads.module';
import { PagevisitsModule } from './page-visits/pagevisits.module';
import { WebinarsModule } from './legacy/dis/legacy/webinars/webinars.module';
import { HubspotModule } from './legacy/dis/legacy/hubspot/hubspot.module';
import { GoogleModule } from './legacy/dis/legacy/google/google.module';
import { AnalyticsModule } from './legacy/dis/legacy/analytics/analytics.module';
import { ZoomModule } from './legacy/dis/legacy/zoom/zoom.module';
import { FileUploadModule } from './legacy/dis/legacy/file-upload/file-upload.module';
import { CalendarModule } from './legacy/dis/legacy/calendar/calendar.module';
import { AllExceptionsFilter } from './internal/common/error/all-exceptions.filter';
import { CmsModule } from './cms/cms/cms.module';
import { BullModule } from '@nestjs/bull';
import { TemplatesModule } from './campaigns/email-campaigns/templates/templates.module';
import { CampaignsModule } from './campaigns/email-campaigns/campaigns/campaigns.module';
import { SegmentsModule } from './campaigns/email-campaigns/segments/segments.module';
import { ContentsModule } from './campaigns/email-campaigns/contents/contents.module';
import { ReferralMarketingModule } from './referral-marketing/referral-marketing/referral-marketing.module';
import { OnDemandEmailsModule } from './campaigns/email-campaigns/on-demand-emails/on-demand-emails.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SesModule } from './internal/libs/aws/ses/ses.module';
import { CampaignAttributesModule } from './campaigns/email-campaigns/attributes/campaign-attributes.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SocialMediaModule } from './campaigns/social-media/social-media.module';
import { EmailHistoryModule } from './campaigns/email-campaigns/email-history/email-history.module';
import { CustomerTemplatesModule } from './campaigns/email-campaigns/customer-templates/customer-templates.module';
import { MagazinesModule } from './referral-marketing/magazines/magazines.module';
import { SnsModule } from '@/internal/libs/aws/sns/sns.module';
import { UploadsModule } from './uploads/uploads.module';
import { S3Module } from '@/internal/libs/aws/s3/s3.module';
import { PaymentsModule as LegacyPaymentModule } from './legacy/dis/legacy/payments/payments.module';
import { HealthCheckModule } from './health-check/health-check.module';
import { ChargifyModule } from './payments/chargify/chargify.module';
import { PaymentsChargifyModule } from './payments/payment_chargify/payments.module';
import { BooksBuilderModule } from './legacy/book-builder/books-builder.module';
import { QrCodeModule } from './referral-marketing/qr-code/qr-code.module';
import { WebhookModule } from './payments/webhook/webhook.module';
import { SmsTemplatesModule } from './campaigns/sms/sms-templates/sms-templates.module';
import { SmsCampaignsModule } from './campaigns/sms/sms-campaigns/sms-campaigns.module';
import { TwilioModule } from '@/campaigns/twillio/twilio.module';
import { CmsBooksModule } from './cms/cms-books/cms-books.module';
import { ShippingEasyModule } from './shipping-easy/shipping-easy.module';
import { DatadogTraceModule } from 'nestjs-ddtrace';
import { DatadogInterceptor } from './internal/common/interceptors/datadog.interceptor';
import { AfyNotificationsModule } from './integrations/afy-notifications/afy-notifications.module';
import { BookCreditsModule } from './credits/book-credits.module';
import { AfyPaymentsModule } from '@/integrations/afy-payments/afy-payments.module';
import AfyLoggerModule from '@/integrations/afy-logger/afy-logger.module';
import { GuideOrdersModule } from '@/guides/orders/guide-orders.module';
import { GuideCatalogModule } from '@/guides/catalog/guide-catalog.module';
import { UpsellModule } from '@/onboard/upsell/upsell.module';
import { AboModule } from '@/abo/abo.module';

@Module({
  imports: [
    ConsoleModule,
    DatadogTraceModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
        connectionFactory: (connection: Connection) => {
          connection.plugin((schema: Schema) => {
            schema.methods.castTo = function (cls) {
              const documentAsObject = this.toObject();
              const plainObject = {
                ...documentAsObject,
                id: documentAsObject._id.toString(),
              };
              // this was done because I did not know how to make the _id
              // show up in the final object as id: string
              // please "fix" this if you know what to do, thank you
              // (it does not need fixing because it works)
              let bookOptions = get(plainObject, ['offer', 'bookOptions']);
              let isOffer = false;
              if (!bookOptions) {
                bookOptions = get(plainObject, ['bookOptions']);
                isOffer = true;
              }
              if (bookOptions) {
                let destination;
                if (isOffer) {
                  destination = plainObject;
                } else {
                  destination = plainObject.offer;
                }
                destination.bookOptions = bookOptions.map((item) => {
                  return {
                    ...item,
                    id: item._id.toString(),
                  };
                });
              }
              const result = plainToInstance(cls, plainObject, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
              });
              return result;
            };
          });
          return connection;
        },
      }),
    }),
    BullModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<string>('redis.port'),
          username: configService.get<string>('redis.username'),
          password: configService.get<string>('redis.password'),
        },
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    OnboardModule,
    UpgradePlanModule,
    TrackingPixelModule,
    CustomersModule,
    ProductsModule,
    ApiKeysModule,
    DisModule,
    GenerateBookModule,
    CoachesModule,
    LegacyPaymentModule,
    WebinarsModule,
    GoogleModule,
    HubspotModule,
    AnalyticsModule,
    ZoomModule,
    FileUploadModule,
    CalendarModule,
    LeadsModule,
    PagevisitsModule,
    CmsModule,
    TemplatesModule,
    BooksBuilderModule,
    CampaignsModule,
    SegmentsModule,
    ContentsModule,
    OnDemandEmailsModule,
    SesModule,
    CampaignAttributesModule,
    SocialMediaModule,
    EmailHistoryModule,
    MagazinesModule,
    ReferralMarketingModule,
    CustomerTemplatesModule,
    SnsModule,
    S3Module,
    UploadsModule,
    HealthCheckModule,
    ChargifyModule,
    PaymentsChargifyModule,
    QrCodeModule,
    WebhookModule,
    SmsTemplatesModule,
    SmsCampaignsModule,
    TwilioModule,
    CmsBooksModule,
    ShippingEasyModule,
    AfyNotificationsModule,
    AfyPaymentsModule,
    BookCreditsModule,
    AfyLoggerModule,
    GuideOrdersModule,
    GuideCatalogModule,
    UpsellModule,
    AboModule,
  ],
  providers: [
    Logger,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ApiKeysGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: DatadogInterceptor,
    },
  ],
})
export class AppModule {}
