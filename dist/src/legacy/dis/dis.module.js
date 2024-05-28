"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisModule = void 0;
const common_1 = require("@nestjs/common");
const dis_service_1 = require("./dis.service");
const axios_1 = require("axios");
const config_1 = require("@nestjs/config");
const hubspot_module_1 = require("./legacy/hubspot/hubspot.module");
const axios_defaults_config_1 = require("../../internal/utils/axiosTranformer/axios-defaults-config");
let DisModule = class DisModule {
};
DisModule = __decorate([
    (0, common_1.Module)({
        imports: [hubspot_module_1.HubspotModule],
        providers: [
            common_1.Logger,
            dis_service_1.DisService,
            {
                inject: [config_1.ConfigService],
                provide: 'HTTP_DIS',
                useFactory: (configService) => {
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)({
                        authorization: `afy-api-key ${configService.get('dis.key')}`,
                    })), { baseURL: configService.get('dis.url') });
                    return new axios_1.Axios(config);
                },
            },
        ],
        exports: [dis_service_1.DisService, 'HTTP_DIS'],
    })
], DisModule);
exports.DisModule = DisModule;
//# sourceMappingURL=dis.module.js.map