"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsModule = void 0;
const common_1 = require("@nestjs/common");
const payments_controller_1 = require("./payments.controller");
const payments_service_1 = require("./payments.service");
const stripe_1 = require("./gateways/stripe");
const config_1 = require("@nestjs/config");
const cms_module_1 = require("../../../../cms/cms/cms.module");
const payments_module_1 = require("../../../../payments/payment_chargify/payments.module");
let PaymentsModule = class PaymentsModule {
};
PaymentsModule = __decorate([
    (0, common_1.Module)({
        imports: [cms_module_1.CmsModule, payments_module_1.PaymentsChargifyModule],
        controllers: [payments_controller_1.PaymentsController],
        exports: [payments_service_1.PaymentsService],
        providers: [
            payments_service_1.PaymentsService,
            {
                provide: 'PAYMENT_GATEWAY',
                useClass: stripe_1.Stripe,
            },
            {
                provide: 'STRIPE_SECRET_KEY',
                useFactory: (configService) => configService.get('stripe.key'),
                inject: [config_1.ConfigService],
            },
        ],
    })
], PaymentsModule);
exports.PaymentsModule = PaymentsModule;
//# sourceMappingURL=payments.module.js.map