"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookModule = void 0;
const common_1 = require("@nestjs/common");
const webhook_service_1 = require("./webhook.service");
const webhook_controller_1 = require("./webhook.controller");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const payments_module_1 = require("../payment_chargify/payments.module");
const products_module_1 = require("../../onboard/products/products.module");
const onboard_module_1 = require("../../onboard/onboard.module");
const cms_module_1 = require("../../cms/cms/cms.module");
const payments_module_2 = require("../../legacy/dis/legacy/payments/payments.module");
const customer_events_module_1 = require("../../customers/customer-events/customer-events.module");
const customer_properties_module_1 = require("../../customers/customer-properties/customer-properties.module");
const webhook_scheduler_1 = require("./webhook.scheduler");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../legacy/dis/legacy/hubspot/constants");
const afy_notifications_module_1 = require("../../integrations/afy-notifications/afy-notifications.module");
const afy_logger_module_1 = require("../../integrations/afy-logger/afy-logger.module");
let WebhookModule = class WebhookModule {
};
WebhookModule = __decorate([
    (0, common_1.Module)({
        imports: [
            hubspot_module_1.HubspotModule,
            payments_module_1.PaymentsChargifyModule,
            products_module_1.ProductsModule,
            onboard_module_1.OnboardModule,
            cms_module_1.CmsModule,
            customer_properties_module_1.CustomerPropertiesModule,
            payments_module_2.PaymentsModule,
            customer_events_module_1.CustomerEventsModule,
            afy_notifications_module_1.AfyNotificationsModule,
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.HUBSPOT_SYNC_ACTIONS_QUEUE,
            }),
            afy_logger_module_1.default,
        ],
        controllers: [webhook_controller_1.WebhookController],
        providers: [webhook_service_1.WebhookService, common_1.Logger, webhook_scheduler_1.WebhookScheduler],
        exports: [webhook_service_1.WebhookService],
    })
], WebhookModule);
exports.WebhookModule = WebhookModule;
//# sourceMappingURL=webhook.module.js.map