"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsChargifyModule = void 0;
const common_1 = require("@nestjs/common");
const payments_controller_1 = require("./payments.controller");
const payments_service_1 = require("./payments.service");
const chargify_module_1 = require("../chargify/chargify.module");
const payments_gateway_1 = require("./gateways/payments.gateway");
const products_module_1 = require("../../onboard/products/products.module");
const cms_module_1 = require("../../cms/cms/cms.module");
let PaymentsChargifyModule = class PaymentsChargifyModule {
};
PaymentsChargifyModule = __decorate([
    (0, common_1.Module)({
        imports: [chargify_module_1.ChargifyModule, products_module_1.ProductsModule, cms_module_1.CmsModule],
        controllers: [payments_controller_1.PaymentChargifyController],
        providers: [payments_service_1.PaymentChargifyService, payments_gateway_1.PaymentsWebsocketGateway, common_1.Logger],
        exports: [payments_service_1.PaymentChargifyService],
    })
], PaymentsChargifyModule);
exports.PaymentsChargifyModule = PaymentsChargifyModule;
//# sourceMappingURL=payments.module.js.map