"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfyPaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const payment_events_controller_1 = require("./controllers/payment-events.controller");
const payments_module_1 = require("../../payments/payment_chargify/payments.module");
const afy_payments_services_1 = require("./afy-payments.services");
const products_module_1 = require("../../onboard/products/products.module");
const hubspot_module_1 = require("../../legacy/dis/legacy/hubspot/hubspot.module");
const bull_1 = require("@nestjs/bull");
const constants_1 = require("../../legacy/dis/legacy/hubspot/constants");
const onboard_module_1 = require("../../onboard/onboard.module");
const customer_events_module_1 = require("../../customers/customer-events/customer-events.module");
const customer_properties_module_1 = require("../../customers/customer-properties/customer-properties.module");
const webhook_module_1 = require("../../payments/webhook/webhook.module");
let AfyPaymentsModule = class AfyPaymentsModule {
};
AfyPaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            payments_module_1.PaymentsChargifyModule,
            products_module_1.ProductsModule,
            hubspot_module_1.HubspotModule,
            onboard_module_1.OnboardModule,
            customer_events_module_1.CustomerEventsModule,
            customer_properties_module_1.CustomerPropertiesModule,
            webhook_module_1.WebhookModule,
            bull_1.BullModule.registerQueueAsync({
                name: constants_1.HUBSPOT_SYNC_ACTIONS_QUEUE,
            }),
        ],
        controllers: [payment_events_controller_1.PaymentEventsController],
        providers: [afy_payments_services_1.AfyPaymentsServices, common_1.Logger],
    })
], AfyPaymentsModule);
exports.AfyPaymentsModule = AfyPaymentsModule;
//# sourceMappingURL=afy-payments.module.js.map