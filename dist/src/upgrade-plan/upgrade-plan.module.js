"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradePlanModule = void 0;
const common_1 = require("@nestjs/common");
const upgrade_plan_controller_1 = require("./upgrade-plan.controller");
const upgrade_plan_service_1 = require("./upgrade-plan.service");
const payments_module_1 = require("../payments/payment_chargify/payments.module");
const products_module_1 = require("../onboard/products/products.module");
const payments_module_2 = require("../legacy/dis/legacy/payments/payments.module");
const hubspot_module_1 = require("../legacy/dis/legacy/hubspot/hubspot.module");
let UpgradePlanModule = class UpgradePlanModule {
};
UpgradePlanModule = __decorate([
    (0, common_1.Module)({
        imports: [
            payments_module_1.PaymentsChargifyModule,
            products_module_1.ProductsModule,
            payments_module_2.PaymentsModule,
            hubspot_module_1.HubspotModule,
        ],
        providers: [upgrade_plan_service_1.UpgradePlanService, common_1.Logger],
        controllers: [upgrade_plan_controller_1.UpgradePlanController],
        exports: [upgrade_plan_service_1.UpgradePlanService],
    })
], UpgradePlanModule);
exports.UpgradePlanModule = UpgradePlanModule;
//# sourceMappingURL=upgrade-plan.module.js.map