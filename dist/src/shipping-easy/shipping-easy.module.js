"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingEasyModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const shipping_easy_service_1 = require("./shipping-easy.service");
const constants_1 = require("./constants");
const hubspot_module_1 = require("../legacy/dis/legacy/hubspot/hubspot.module");
const shiping_easy_scheduler_1 = require("./shiping-easy.scheduler");
const customer_properties_module_1 = require("../customers/customer-properties/customer-properties.module");
let ShippingEasyModule = class ShippingEasyModule {
};
ShippingEasyModule = __decorate([
    (0, common_1.Module)({
        imports: [hubspot_module_1.HubspotModule, customer_properties_module_1.CustomerPropertiesModule],
        controllers: [],
        providers: [
            shipping_easy_service_1.ShippingEasyService,
            shiping_easy_scheduler_1.ShippingEasyScheduler,
            common_1.Logger,
            {
                provide: constants_1.SHIPPINGEASY_PROVIDER_NAME,
                useFactory: (configService) => {
                    const baseURL = configService.get('shippingEasy.subDomain');
                    return new axios_1.Axios({ baseURL });
                },
                inject: [config_1.ConfigService],
            },
            {
                inject: [config_1.ConfigService],
                provide: constants_1.SHIPPINGEASY_API_KEY,
                useFactory: (configService) => {
                    return configService.get('shippingEasy.apiKey');
                },
            },
            {
                inject: [config_1.ConfigService],
                provide: constants_1.SHIPPINGEASY_SECRET_KEY,
                useFactory: (configService) => {
                    return configService.get('shippingEasy.apiSecret');
                },
            },
        ],
        exports: [shipping_easy_service_1.ShippingEasyService],
    })
], ShippingEasyModule);
exports.ShippingEasyModule = ShippingEasyModule;
//# sourceMappingURL=shipping-easy.module.js.map