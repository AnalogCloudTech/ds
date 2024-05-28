"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardModule = void 0;
const common_1 = require("@nestjs/common");
const onboard_service_1 = require("./onboard.service");
const mongoose_1 = require("@nestjs/mongoose");
const AutoIncrementFactory = require("mongoose-sequence");
const session_schema_1 = require("./schemas/session.schema");
const offer_schema_1 = require("./schemas/offer.schema");
const onboard_controller_1 = require("./onboard.controller");
const customers_service_1 = require("../customers/customers/customers.service");
const dis_module_1 = require("../legacy/dis/dis.module");
const products_module_1 = require("./products/products.module");
const webhook_idempotency_schema_1 = require("./schemas/webhook-idempotency.schema");
const coaches_module_1 = require("./coaches/coaches.module");
const book_option_schema_1 = require("./schemas/book-option.schema");
const generate_book_module_1 = require("./generate-book/generate-book.module");
const generate_book_service_1 = require("./generate-book/generate-book.service");
const config_1 = require("@nestjs/config");
const hubspot_module_1 = require("../legacy/dis/legacy/hubspot/hubspot.module");
const onboard_consumer_1 = require("./onboard.consumer");
const onboard_processor_1 = require("./onboard.processor");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("./constants");
const leads_module_1 = require("../campaigns/email-campaigns/leads/leads.module");
const ses_module_1 = require("../internal/libs/aws/ses/ses.module");
const ses_service_1 = require("../internal/libs/aws/ses/ses.service");
const cms_module_1 = require("../cms/cms/cms.module");
const payments_module_1 = require("../legacy/dis/legacy/payments/payments.module");
const payments_module_2 = require("../payments/payment_chargify/payments.module");
const email_reminders_module_1 = require("./email-reminders/email-reminders.module");
const chargify_module_1 = require("../payments/chargify/chargify.module");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../internal/utils/axiosTranformer/axios-defaults-config");
const calendar_module_1 = require("../legacy/dis/legacy/calendar/calendar.module");
const customer_events_module_1 = require("../customers/customer-events/customer-events.module");
const session_repository_1 = require("./repositories/session.repository");
const session_service_1 = require("./services/session.service");
const customer_properties_module_1 = require("../customers/customer-properties/customer-properties.module");
const onboard_scheduler_1 = require("./onboard.scheduler");
const afy_logger_module_1 = require("../integrations/afy-logger/afy-logger.module");
const dentist_coaches_module_1 = require("./dentist-coaches/dentist-coaches.module");
const offers_service_1 = require("./services/offers.service");
const offers_repository_1 = require("./repositories/offers.repository");
const s3_module_1 = require("../internal/libs/aws/s3/s3.module");
let OnboardModule = class OnboardModule {
};
OnboardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            dis_module_1.DisModule,
            coaches_module_1.CoachesModule,
            products_module_1.ProductsModule,
            leads_module_1.LeadsModule,
            ses_module_1.SesModule,
            generate_book_module_1.GenerateBookModule,
            cms_module_1.CmsModule,
            hubspot_module_1.HubspotModule,
            payments_module_1.PaymentsModule,
            payments_module_2.PaymentsChargifyModule,
            email_reminders_module_1.EmailRemindersModule,
            customer_events_module_1.CustomerEventsModule,
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.COACHING_REMINDER_EMAIL_NAME,
            }, {
                name: constants_1.DEALS_COACHING_DETAILS_PROCESSOR,
            }),
            mongoose_1.MongooseModule.forFeatureAsync([
                {
                    name: session_schema_1.Session.name,
                    useFactory: (connection) => {
                        const AutoIncrement = AutoIncrementFactory(connection);
                        const schema = session_schema_1.SessionSchema;
                        schema.plugin(AutoIncrement, {
                            inc_field: 'order',
                            start_seq: 1,
                        });
                        return schema;
                    },
                    inject: [(0, mongoose_1.getConnectionToken)()],
                },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: offer_schema_1.Offer.name, schema: offer_schema_1.OfferSchema },
                { name: webhook_idempotency_schema_1.WebhookIdempotency.name, schema: webhook_idempotency_schema_1.WebhookIdempotencySchema },
                { name: book_option_schema_1.BookOption.name, schema: book_option_schema_1.BookOptionSchema },
            ]),
            chargify_module_1.ChargifyModule,
            calendar_module_1.CalendarModule,
            customer_properties_module_1.CustomerPropertiesModule,
            afy_logger_module_1.default,
            dentist_coaches_module_1.DentistCoachesModule,
            s3_module_1.S3Module,
        ],
        providers: [
            ses_service_1.SesService,
            onboard_service_1.OnboardService,
            customers_service_1.CustomersService,
            generate_book_service_1.GenerateBookService,
            common_1.Logger,
            session_service_1.SessionService,
            session_repository_1.SessionRepository,
            onboard_consumer_1.OnboardConsumer,
            onboard_processor_1.OnboardProcessor,
            onboard_processor_1.CoachingDetailsProcessor,
            onboard_scheduler_1.OnboardScheduler,
            offers_repository_1.OffersRepository,
            offers_service_1.OffersService,
            {
                provide: 'CONTENT_CONFIG',
                useFactory: (configService) => configService.get('content'),
                inject: [config_1.ConfigService],
            },
            {
                provide: 'HTTP_DIS',
                useFactory: (configService) => {
                    const baseURL = configService.get('bookApi.url');
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)()), { baseURL });
                    return new axios_1.Axios(config);
                },
                inject: [config_1.ConfigService],
            },
            {
                inject: [config_1.ConfigService],
                provide: 'SCHEDULE_COACH_DURATION',
                useFactory: (configService) => {
                    return configService.get('onboardSettings.scheduleCoachDuration');
                },
            },
        ],
        controllers: [onboard_controller_1.OnboardController],
        exports: [onboard_service_1.OnboardService, session_service_1.SessionService, session_repository_1.SessionRepository],
    })
], OnboardModule);
exports.OnboardModule = OnboardModule;
//# sourceMappingURL=onboard.module.js.map