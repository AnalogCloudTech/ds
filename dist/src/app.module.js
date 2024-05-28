"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_console_1 = require("nestjs-console");
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const lodash_1 = require("lodash");
const app_config_1 = require("./internal/config/app.config");
const onboard_module_1 = require("./onboard/onboard.module");
const upgrade_plan_module_1 = require("./upgrade-plan/upgrade-plan.module");
const tracking_pixel_module_1 = require("./onboard/tracking-pixel/tracking-pixel.module");
const customers_module_1 = require("./customers/customers/customers.module");
const api_keys_module_1 = require("./auth/api-keys/api-keys.module");
const auth_module_1 = require("./auth/auth.module");
const api_keys_guard_1 = require("./internal/common/guards/api-keys.guard");
const jwt_guard_1 = require("./internal/common/guards/jwt.guard");
const auth_service_1 = require("./auth/auth.service");
const generate_book_module_1 = require("./onboard/generate-book/generate-book.module");
const products_module_1 = require("./onboard/products/products.module");
const coaches_module_1 = require("./onboard/coaches/coaches.module");
const dis_module_1 = require("./legacy/dis/dis.module");
const leads_module_1 = require("./campaigns/email-campaigns/leads/leads.module");
const pagevisits_module_1 = require("./page-visits/pagevisits.module");
const webinars_module_1 = require("./legacy/dis/legacy/webinars/webinars.module");
const hubspot_module_1 = require("./legacy/dis/legacy/hubspot/hubspot.module");
const google_module_1 = require("./legacy/dis/legacy/google/google.module");
const analytics_module_1 = require("./legacy/dis/legacy/analytics/analytics.module");
const zoom_module_1 = require("./legacy/dis/legacy/zoom/zoom.module");
const file_upload_module_1 = require("./legacy/dis/legacy/file-upload/file-upload.module");
const calendar_module_1 = require("./legacy/dis/legacy/calendar/calendar.module");
const all_exceptions_filter_1 = require("./internal/common/error/all-exceptions.filter");
const cms_module_1 = require("./cms/cms/cms.module");
const bull_1 = require("@nestjs/bull");
const templates_module_1 = require("./campaigns/email-campaigns/templates/templates.module");
const campaigns_module_1 = require("./campaigns/email-campaigns/campaigns/campaigns.module");
const segments_module_1 = require("./campaigns/email-campaigns/segments/segments.module");
const contents_module_1 = require("./campaigns/email-campaigns/contents/contents.module");
const referral_marketing_module_1 = require("./referral-marketing/referral-marketing/referral-marketing.module");
const on_demand_emails_module_1 = require("./campaigns/email-campaigns/on-demand-emails/on-demand-emails.module");
const schedule_1 = require("@nestjs/schedule");
const ses_module_1 = require("./internal/libs/aws/ses/ses.module");
const campaign_attributes_module_1 = require("./campaigns/email-campaigns/attributes/campaign-attributes.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const social_media_module_1 = require("./campaigns/social-media/social-media.module");
const email_history_module_1 = require("./campaigns/email-campaigns/email-history/email-history.module");
const customer_templates_module_1 = require("./campaigns/email-campaigns/customer-templates/customer-templates.module");
const magazines_module_1 = require("./referral-marketing/magazines/magazines.module");
const sns_module_1 = require("./internal/libs/aws/sns/sns.module");
const uploads_module_1 = require("./uploads/uploads.module");
const s3_module_1 = require("./internal/libs/aws/s3/s3.module");
const payments_module_1 = require("./legacy/dis/legacy/payments/payments.module");
const health_check_module_1 = require("./health-check/health-check.module");
const chargify_module_1 = require("./payments/chargify/chargify.module");
const payments_module_2 = require("./payments/payment_chargify/payments.module");
const books_builder_module_1 = require("./legacy/book-builder/books-builder.module");
const qr_code_module_1 = require("./referral-marketing/qr-code/qr-code.module");
const webhook_module_1 = require("./payments/webhook/webhook.module");
const sms_templates_module_1 = require("./campaigns/sms/sms-templates/sms-templates.module");
const sms_campaigns_module_1 = require("./campaigns/sms/sms-campaigns/sms-campaigns.module");
const twilio_module_1 = require("./campaigns/twillio/twilio.module");
const cms_books_module_1 = require("./cms/cms-books/cms-books.module");
const shipping_easy_module_1 = require("./shipping-easy/shipping-easy.module");
const nestjs_ddtrace_1 = require("nestjs-ddtrace");
const datadog_interceptor_1 = require("./internal/common/interceptors/datadog.interceptor");
const afy_notifications_module_1 = require("./integrations/afy-notifications/afy-notifications.module");
const book_credits_module_1 = require("./credits/book-credits.module");
const afy_payments_module_1 = require("./integrations/afy-payments/afy-payments.module");
const afy_logger_module_1 = require("./integrations/afy-logger/afy-logger.module");
const guide_orders_module_1 = require("./guides/orders/guide-orders.module");
const guide_catalog_module_1 = require("./guides/catalog/guide-catalog.module");
const upsell_module_1 = require("./onboard/upsell/upsell.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_console_1.ConsoleModule,
            nestjs_ddtrace_1.DatadogTraceModule.forRoot(),
            config_1.ConfigModule.forRoot({ isGlobal: true, load: [app_config_1.default] }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('database.url'),
                    connectionFactory: (connection) => {
                        connection.plugin((schema) => {
                            schema.methods.castTo = function (cls) {
                                const documentAsObject = this.toObject();
                                const plainObject = Object.assign(Object.assign({}, documentAsObject), { id: documentAsObject._id.toString() });
                                let bookOptions = (0, lodash_1.get)(plainObject, ['offer', 'bookOptions']);
                                let isOffer = false;
                                if (!bookOptions) {
                                    bookOptions = (0, lodash_1.get)(plainObject, ['bookOptions']);
                                    isOffer = true;
                                }
                                if (bookOptions) {
                                    let destination;
                                    if (isOffer) {
                                        destination = plainObject;
                                    }
                                    else {
                                        destination = plainObject.offer;
                                    }
                                    destination.bookOptions = bookOptions.map((item) => {
                                        return Object.assign(Object.assign({}, item), { id: item._id.toString() });
                                    });
                                }
                                const result = (0, class_transformer_1.plainToInstance)(cls, plainObject, {
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
            bull_1.BullModule.forRootAsync({
                imports: [],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('redis.host'),
                        port: configService.get('redis.port'),
                        username: configService.get('redis.username'),
                        password: configService.get('redis.password'),
                    },
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            auth_module_1.AuthModule,
            onboard_module_1.OnboardModule,
            upgrade_plan_module_1.UpgradePlanModule,
            tracking_pixel_module_1.TrackingPixelModule,
            customers_module_1.CustomersModule,
            products_module_1.ProductsModule,
            api_keys_module_1.ApiKeysModule,
            dis_module_1.DisModule,
            generate_book_module_1.GenerateBookModule,
            coaches_module_1.CoachesModule,
            payments_module_1.PaymentsModule,
            webinars_module_1.WebinarsModule,
            google_module_1.GoogleModule,
            hubspot_module_1.HubspotModule,
            analytics_module_1.AnalyticsModule,
            zoom_module_1.ZoomModule,
            file_upload_module_1.FileUploadModule,
            calendar_module_1.CalendarModule,
            leads_module_1.LeadsModule,
            pagevisits_module_1.PagevisitsModule,
            cms_module_1.CmsModule,
            templates_module_1.TemplatesModule,
            books_builder_module_1.BooksBuilderModule,
            campaigns_module_1.CampaignsModule,
            segments_module_1.SegmentsModule,
            contents_module_1.ContentsModule,
            on_demand_emails_module_1.OnDemandEmailsModule,
            ses_module_1.SesModule,
            campaign_attributes_module_1.CampaignAttributesModule,
            social_media_module_1.SocialMediaModule,
            email_history_module_1.EmailHistoryModule,
            magazines_module_1.MagazinesModule,
            referral_marketing_module_1.ReferralMarketingModule,
            customer_templates_module_1.CustomerTemplatesModule,
            sns_module_1.SnsModule,
            s3_module_1.S3Module,
            uploads_module_1.UploadsModule,
            health_check_module_1.HealthCheckModule,
            chargify_module_1.ChargifyModule,
            payments_module_2.PaymentsChargifyModule,
            qr_code_module_1.QrCodeModule,
            webhook_module_1.WebhookModule,
            sms_templates_module_1.SmsTemplatesModule,
            sms_campaigns_module_1.SmsCampaignsModule,
            twilio_module_1.TwilioModule,
            cms_books_module_1.CmsBooksModule,
            shipping_easy_module_1.ShippingEasyModule,
            afy_notifications_module_1.AfyNotificationsModule,
            afy_payments_module_1.AfyPaymentsModule,
            book_credits_module_1.BookCreditsModule,
            afy_logger_module_1.default,
            guide_orders_module_1.GuideOrdersModule,
            guide_catalog_module_1.GuideCatalogModule,
            upsell_module_1.UpsellModule,
        ],
        providers: [
            common_1.Logger,
            auth_service_1.AuthService,
            {
                provide: core_1.APP_GUARD,
                useClass: api_keys_guard_1.ApiKeysGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_guard_1.JwtGuard,
            },
            { provide: core_1.APP_FILTER, useClass: all_exceptions_filter_1.AllExceptionsFilter },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: datadog_interceptor_1.DatadogInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map