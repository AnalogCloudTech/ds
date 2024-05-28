"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const analytics_controller_1 = require("./analytics.controller");
const config_1 = require("@nestjs/config");
const api_client_1 = require("@hubspot/api-client");
const leads_module_1 = require("../../../../campaigns/email-campaigns/leads/leads.module");
const axios_1 = require("axios");
const axios_defaults_config_1 = require("../../../../internal/utils/axiosTranformer/axios-defaults-config");
let AnalyticsModule = class AnalyticsModule {
};
AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [leads_module_1.LeadsModule],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [
            common_1.Logger,
            analytics_service_1.AnalyticsService,
            {
                inject: [config_1.ConfigService],
                provide: 'HTTP_ANALYTICS',
                useFactory: (configService) => {
                    const config = Object.assign(Object.assign({}, (0, axios_defaults_config_1.axiosDefaultsConfig)()), { auth: {
                            username: configService.get('elasticSearch.username'),
                            password: configService.get('elasticSearch.password'),
                        }, baseURL: configService.get('elasticSearch.url') });
                    return new axios_1.Axios(config);
                },
            },
            {
                inject: [config_1.ConfigService],
                provide: api_client_1.Client,
                useFactory: (configService) => {
                    const accessToken = configService.get('hubspot.key');
                    return new api_client_1.Client({
                        accessToken,
                    });
                },
            },
        ],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);
exports.AnalyticsModule = AnalyticsModule;
//# sourceMappingURL=analytics.module.js.map