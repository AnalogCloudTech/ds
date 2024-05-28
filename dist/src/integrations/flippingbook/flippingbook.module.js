"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlippingBookModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../../internal/utils/axiosTranformer/axios-defaults-config");
const flippingbook_service_1 = require("./services/flippingbook.service");
let FlippingBookModule = class FlippingBookModule {
};
FlippingBookModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [
            {
                provide: 'HTTP_FLIPPING_API',
                useFactory: (configService) => {
                    const baseURL = configService.get('flippingAPI.url');
                    const key = configService.get('flippingAPI.key');
                    return new axios_1.Axios(Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)({
                        authorization: `Bearer ${key}`,
                    })), { baseURL }));
                },
                inject: [config_1.ConfigService],
            },
            flippingbook_service_1.FlippingBookService,
        ],
        exports: [flippingbook_service_1.FlippingBookService],
    })
], FlippingBookModule);
exports.FlippingBookModule = FlippingBookModule;
//# sourceMappingURL=flippingbook.module.js.map