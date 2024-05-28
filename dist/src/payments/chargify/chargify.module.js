"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChargifyModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const chargify_controller_1 = require("./chargify.controller");
const chargify_service_1 = require("./chargify.service");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../../internal/utils/axiosTranformer/axios-defaults-config");
let ChargifyModule = class ChargifyModule {
};
ChargifyModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [chargify_controller_1.ChargifyController],
        providers: [
            chargify_service_1.ChargifyService,
            {
                provide: 'HTTP_CHARGIFY',
                useFactory: (configService) => {
                    if (configService.get('env') == 'test') {
                        return null;
                    }
                    const baseURL = configService.get('chargify.sub_domain');
                    const key = configService.get('chargify.api_key');
                    const buffer = Buffer.from(key);
                    const base64EncodedAPIKey = buffer.toString('base64');
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)({
                        authorization: `Basic ${base64EncodedAPIKey}`,
                    })), { baseURL });
                    return new axios_1.Axios(config);
                },
                inject: [config_1.ConfigService],
            },
        ],
        exports: [chargify_service_1.ChargifyService],
    })
], ChargifyModule);
exports.ChargifyModule = ChargifyModule;
//# sourceMappingURL=chargify.module.js.map